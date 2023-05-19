import { Body, Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, Req } from '@nestjs/common';
import { AdminOnly, CurrentUser, WithAuth } from '../User/Auth.guards';
import { GameService } from './game.service';
import { Game } from '@prisma/client';
import { GameSetup, RoundSetup } from 'src/types/game';
import GameUtilsService from './gameUtils.service';
import { UserService } from '../User/User.service';
import GameResultService from './gameResult.service';

@Controller('games')
@WithAuth()
export class GameController {

    constructor(
        private readonly gameService: GameService,
        private readonly gameUtilsService: GameUtilsService,
        private readonly userService: UserService,
        private readonly gameResultService: GameResultService
    ) { }

    @Post('/testSet')
    @AdminOnly()
    async createTestSet(): Promise<GameSetup> {

        return null as never;
    }

    @Get('/event/:id')
    @WithAuth()
    async getGameByEventId(@Param('id', ParseIntPipe) eventId: number): Promise<Game> {
        return await this.gameUtilsService.getGameByEventId(eventId);
    }

    @Post('/start')
    @AdminOnly()
    async startGame(@Body('eventId', ParseIntPipe) eventId: number): Promise<GameSetup> {

        try {
            const game = await this.gameService.startGame(eventId);
            const setup = await this.gameService.getGameSetup(game.id);
            return setup;

        } catch (e) {
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('/:id/setup')
    @AdminOnly()
    async getGameSetup(@Param('id', ParseIntPipe) gameId: number): Promise<GameSetup> {
        try {
            const setup = await this.gameService.getGameSetup(gameId);
            return setup;

        } catch (e) {
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('/:id/round/next')
    @AdminOnly()
    async goToNextRound(@Param('id', ParseIntPipe) gameId: number): Promise<RoundSetup> {
        try {
            const game = await this.gameService.moveGameToNextRound(gameId);
            const setup = await this.gameService.getCurrentRoundSetup(game.id);
            return setup;

        } catch (e) {
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Admin: Close game
    @Post('/:id/close')
    @AdminOnly()
    async closeGame(@Param('id', ParseIntPipe) gameId: number): Promise<Game> {
        try {
            const game = await this.gameService.closeGame(gameId);
            return game;

        } catch (e) {
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // User: game polling to see current round
    @Get('/:id/round/current')
    @WithAuth()
    async getCurrentRound(
        @Param('id', ParseIntPipe) gameId: number,
        @CurrentUser('id', ParseIntPipe) userId: number
    ): Promise<RoundSetup | any> {
        const isAllowed = await this.gameUtilsService.isUserParticipant(gameId, userId);
        if (!isAllowed) {
            throw new HttpException('User is not allowed to see this game', HttpStatus.FORBIDDEN);
        }

        try {
            const gameSetup = await this.gameService.getGameSetup(gameId);
            if (gameSetup.status === 'FINAL') {
                return {
                    status: 'FINAL',
                    roundCount: gameSetup.rounds.length,
                    currentArrangement: null,
                }
            }

            const setup = await this.gameService.getCurrentRoundSetup(gameId);
            const participantId = await this.gameService.getParticipantIdByUserId(userId, gameId);

            const userArrangement = setup.tableArrangements.find(a => [a.participantAId, a.participantBId].includes(participantId));
            const partnerPId = [userArrangement.participantAId, userArrangement.participantBId].find(pId => pId !== participantId);
            const partnerUid = await this.gameService.getUserIdByParticipantId(partnerPId);

            const partner = partnerUid ? await this.userService.getPublicProfileById(partnerUid) : null;

            const currentArrangement = {
                table: {
                    id: 0,
                    title: 'Table'
                },
                partner,
                userId,
                participantId,
                ...userArrangement
            }
            const result = {
                status: gameSetup.status,
                roundCount: gameSetup.rounds.length,
                currentArrangement,
                ...setup
            }
            return result;

        } catch (e) {
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('/:id/results/preliminary')
    @WithAuth()
    async getPreliminaryResults(
        @Param('id', ParseIntPipe) gameId: number,
        @CurrentUser('id', ParseIntPipe) userId: number
    ): Promise<any> {
        const isAllowed = await this.gameUtilsService.isUserParticipant(gameId, userId);
        if (!isAllowed) {
            throw new HttpException('User is not allowed to see this game', HttpStatus.FORBIDDEN);
        }

        const results = await this.gameResultService.getGameUserPreliminaryResults(gameId, userId);
        return results;
    }

    @Put('/:id/results')
    @WithAuth()
    async submitResults(
        @Param('id', ParseIntPipe) gameId: number,
        @Body('entries') rawResults: any,
        @CurrentUser('id', ParseIntPipe) userId: number
    ) {
        const isAllowed = await this.gameUtilsService.isUserParticipant(gameId, userId);
        if (!isAllowed) {
            throw new HttpException('User is not allowed to see this game', HttpStatus.FORBIDDEN);
        }

        const results = JSON.parse(rawResults);

        await Promise.all(results.map(async (entry) => {
            return Promise.all([
                this.gameResultService.setLike(gameId, userId, entry.id, entry.like),
                this.gameResultService.setNote(userId, entry.id, entry.note)
            ])
        }))

        return await this.gameResultService.getGameUserPreliminaryResults(gameId, userId);
    }
}
