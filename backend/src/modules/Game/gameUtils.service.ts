import { Inject, Injectable } from "@nestjs/common";
import { Game, PrismaClient } from "@prisma/client";

@Injectable()
export default class GameUtilsService {

    constructor(private readonly prismaClient: PrismaClient) {}

    async isUserParticipant(gameId: number, userId: number): Promise<boolean> {
        const participant = await this.prismaClient.participant.findFirst({
            where: {
                gameId,
                userId,
            }
        });
        return !!participant;
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

}