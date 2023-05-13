import { Injectable } from '@nestjs/common';
import { EventStatus, Game, GameStatus, Participant, PrismaClient, Round } from '@prisma/client';
import colors from '../../config/colors';
import calculatePositions, { CalculatedRound, TableRound } from '../../utils/calculation';
import { GameSetup, RoundSetup } from 'src/types/game';

@Injectable()
export class GameService {
    constructor(
        private readonly prismaClient: PrismaClient,
    ) {}


    // Refactor - create game builder/fabric
    async startGame(eventId: number): Promise<Game> {
        // Step 1. Get event
        const event = await this.prismaClient.event.findUnique({
            where: { id: eventId, },
            include: { participants: true }
        });

        if (event.status !== EventStatus.OPEN) {
            throw new Error('Event is not open');
        }


        // Step 2. Move event to running status
        await this.prismaClient.event.update({
            where: {
                id: eventId,
            },
            data: {
                status: EventStatus.RUNNING,
            }
        });

        // Step 3. Create game object
        const game = await this.prismaClient.game.create({
            data: {
                eventId: eventId,
                status: GameStatus.PREPARED,
            }
        });

        // Step 4. Calculate and put tables
        const participants = event.participants;
        const shuffledColors = colors.sort(() => Math.random() - 0.5);
        const tableTitles = new Array(Math.ceil(participants.length / 2)).fill(0).map((_, i) => shuffledColors[i]);

        const tables = await this.prismaClient.table.createMany({
            data: tableTitles.map((color, i) => ({
                gameId: game.id,
                title: color,
            }))
        });

        const operatingTables = await this.prismaClient.table.findMany({
            where: {
                gameId: game.id,
            }
        });

        // Step 5. Calculate rounds and put in DB
        const rounds: CalculatedRound[] = calculatePositions(
            participants.map(p => p.id),
            operatingTables.map(t => t.id),
        )

        await this.prismaClient.round.createMany({
            data: rounds.map((r) => ({
                gameId: game.id,
                index: r.index,
            }))
        })

        const tableRounds = await this.prismaClient.round.findMany({
            where: { gameId: game.id },
        });

        const tableArrangementSet = rounds.flatMap((round) => {
            // TableArrangement[][]
            return round.tableParticipants.flatMap((tr: TableRound) => {

                // TableArrangement[]
                return {
                    tableId: tr.tableId,
                    roundId: tableRounds.find((r) => r.index === round.index)?.id,
                    participantAId: tr.participants[0],
                    participantBId: tr.participants[1],
                }
            })
        })

        await this.prismaClient.tableArrangement.createMany({
            data: tableArrangementSet
        });


        // Step 6. Set first round
        const startedGame = await this.prismaClient.game.update({
            where: {
                id: game.id,
            },
            data: {
                currentRoundId: tableRounds.find((r) => r.index === 0).id,
                status: GameStatus.RUNNING,
            }
        });

        await this.prismaClient.event.update({
            where: {
                id: eventId,
            },
            data: {
                status: EventStatus.RUNNING,
            }
        });

        // Step Final. Return full game object

        return startedGame;
    }

    async getGameByEventId(eventId: number): Promise<Game> {
        return await this.prismaClient.game.findUnique({ where: { eventId: eventId }, });
    }

    async getGameById(gameId: number): Promise<Game> {
        const game = await this.prismaClient.game.findUnique({ where: { id: gameId }, });
        if (!game) {
            throw new Error('Game not found!');
        }
        return game;
    }
    async getGameSetup(gameId: number): Promise<GameSetup> {

        const game = await this.getGameById(gameId);
        const participants = await this.prismaClient.participant.findMany({
            where: { eventId: game.eventId },
            include: { user: true }
        });
        const tables = await this.prismaClient.table.findMany({ where: { gameId: gameId } });
        const rounds = await this.prismaClient.round.findMany({ where: { gameId: gameId } });
        const tableArrangements = await this.prismaClient.tableArrangement.findMany({
            where: {
                roundId: { in: rounds.map((r) => r.id), }
            }
        });

        return {
            ...game,
            participants: participants,
            tables: tables,
            rounds: rounds.sort((r1, r2) => r1.index - r2.index),
            tableArrangements: tableArrangements,
        }
    }

    async getCurrentRoundSetup(gameId: number): Promise<RoundSetup> {

        const round = await this.prismaClient.round.findUnique({
            where: {
                id: (await this.getGameById(gameId)).currentRoundId,
            },
            include: {
                tableArrangements: true
            }
        });
        const tables = await this.prismaClient.table.findMany({ where: { gameId: gameId } });

        return {
            ...round,
            tables: tables,
        }
    }

    async moveGameToNextRound(gameId: number): Promise<Game> {
        const game: Game = await this.getGameById(gameId);
        const rounds: Round[] = await this.prismaClient.round.findMany({ where: { gameId: gameId } });
        const currentRoundIndex = rounds.find((r) => r.id === game.currentRoundId).index;

        if (currentRoundIndex === rounds.length - 1) {
            // Game final
            game.status = GameStatus.FINAL;
            game.currentRoundId = null;
            await this.prismaClient.game.update({ where: { id: gameId }, data: { status: GameStatus.FINAL, currentRoundId: null } });
            await this.prismaClient.event.update({ where: { id: game.eventId }, data: { status: EventStatus.FINAL } });
        } else {
            const nextRoundId = rounds.find((r) => r.index === currentRoundIndex + 1)?.id;
            game.currentRoundId = nextRoundId;
            await this.prismaClient.game.update({ where: { id: gameId }, data: { currentRoundId: nextRoundId } });
        }
        return game;
    }

    async closeGame(gameId: number): Promise<Game> {
        const game: Game = await this.getGameById(gameId);
        if (game.status !== GameStatus.FINAL) {
            throw new Error('Game is not in final status!');
        }
        game.status = GameStatus.CLOSED;
        await this.prismaClient.game.update({ where: { id: gameId }, data: { status: GameStatus.CLOSED } });

        return game;
    }

}
