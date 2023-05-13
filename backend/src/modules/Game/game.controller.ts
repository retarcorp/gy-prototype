import { Body, Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post } from '@nestjs/common';
import { AdminOnly, WithAuth } from '../User/Auth.guards';
import { GameService } from './game.service';
import { Game } from '@prisma/client';
import { GameSetup, RoundSetup } from 'src/types/game';

@Controller('games')
@WithAuth()
export class GameController {

    constructor(
        private readonly gameService: GameService
    ) { }

    @Post('/testSet')
    @AdminOnly()
    async createTestSet(): Promise<GameSetup> {

        return null as never;
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
    // User: toggle like
    // User: put note for entry
    // User: get list of entries/records
    // User: update list of entries/records



}
