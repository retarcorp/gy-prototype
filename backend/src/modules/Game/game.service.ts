import { Injectable } from '@nestjs/common';
import { Game } from '@prisma/client';

@Injectable()
export class GameService {
    constructor() { 

    }


    async startGame(eventId: number): Promise<Game> {
        // Step 1. Get event
        // Step 2. Move event to running status
        // Step 3. Create game object
        // Step 4. Calculate and put tables
        // Step 5. Calculate rounds and put in DB
        // Step 6. Set first round
        // Step 7. Return full game object

        return null as never;
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
