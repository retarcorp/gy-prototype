import { Injectable } from "@nestjs/common";
import { GameLike, PrismaClient, UserNotes } from "@prisma/client";
import { UserService } from "../User/User.service";
import { GameService } from "./game.service";

@Injectable()
export default class GameResultService {
    constructor(
        private readonly prismaClient: PrismaClient,
        private readonly userService: UserService,
        private readonly gameService: GameService,
    ) {}

    async toggleLike(gameId: number, userId: number, targetUserId: number): Promise<boolean> {
        const isValidParticipants = (await this.gameService.isUserParticipant(gameId, userId))
            && (await this.gameService.isUserParticipant(gameId, targetUserId));
        if (!isValidParticipants) {
            console.log(gameId, userId, targetUserId)
            throw new Error('Invalid participants');
        }

        const likes = await this.prismaClient.gameLike.findMany({ where: { gameId, userId, targetUserId } });
        if (likes.length > 0) {
            // Removing like
            await this.prismaClient.gameLike.deleteMany({ where: { gameId, userId, targetUserId } });
            return false;
        }

        // Adding like
        await this.prismaClient.gameLike.create({ data: { gameId, userId, targetUserId } });
        return true;
    }

    async getGameUserLikes(gameId: number, userId: number): Promise<GameLike[]> {
        return await this.prismaClient.gameLike.findMany({
            where: { gameId, userId },
        });
    }

    async setNote(userId: number, targetUserId: number, content: string): Promise<UserNotes> {
        const note = await this.prismaClient.userNotes.findFirst({
            where: { userId, targetUserId },
        });

        if (note) {
            await this.prismaClient.userNotes.update({
                where: { id: note.id },
                data: { notes: content },
            });
            return;
        }

        await this.prismaClient.userNotes.create({
            data: {
                userId,
                targetUserId,
                notes: content,
            }
        });

        return await this.prismaClient.userNotes.findFirst({ where: { userId, targetUserId } });
    }

    async getUserNotes(userId: number) {
        const notes = await this.prismaClient.userNotes.findMany({
            where: { userId },
            include: { user: true },
        });

        return notes.map(note => ({
            ...note,
            targetUser: this.userService.getPublicProfile(note.user),
        }));
    }

    

}