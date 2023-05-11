import { Injectable } from '@nestjs/common';
import { EventStatus, Game, GameStatus, PrismaClient } from '@prisma/client';
import colors from 'src/config/colors';
import calculatePositions, { CalculatedRound, TableRound } from 'src/utils/calculation';

@Injectable()
export class GameService {
    constructor(
        private readonly prismaClient: PrismaClient,
    ) {

    }


    // Refactor - create game builder/fabric
    async startGame(eventId: number): Promise<Game> {
        // Step 1. Get event
        const event = await this.prismaClient.event.findUnique({
            where: {
                id: eventId,
            },
            include: {
                participants: true
            }
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
                currentRoundId: 0,
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

    async testGame(): Promise<never> {
        // Step 1. Register N users
        // Step 2. Create event and put in appropriate status
        // Step 3. Register all users to this event
        // Step 4. Open event for enrollment
        // Step 5. Enroll all users to event
        // Step 6. Start game



        throw new Error('Not implemented');
    }

    async getGameByEventId(eventId: number): Promise<Game> {

        return null as never;
    }

    async getGameById(gameId: number): Promise<Game> {

        return null as never;
    }

    async moveGameToNextRound(gameId: number): Promise<Game> {

        return null as never;
    }

    async closeGame(gameId: number): Promise<Game> {

        return null as never;
    }
}
