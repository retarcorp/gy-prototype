import { Injectable } from "@nestjs/common";
import { GameLike, GameStatus, PrismaClient, UserNotes } from "@prisma/client";
import { UserService } from "../User/User.service";
import { GameService } from "./game.service";
import { PreliminaryResults } from "src/types/game";

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

        const game = await this.prismaClient.game.findFirst({ where: { id: gameId } });
        if (!game) {
            throw new Error('Game not found');
        }
        const isGameOpenForLikes = ([GameStatus.RUNNING, GameStatus.FINAL] as GameStatus[]).includes(game.status)
        if (!isGameOpenForLikes) {
            throw new Error('Game is not open for likes!');
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

    async getUserNotes(userId: number): Promise<UserNotes[]> {
        const notes = await this.prismaClient.userNotes.findMany({
            where: { userId },
            include: { user: true },
        });

        return notes.map(note => ({
            ...note,
            targetUser: this.userService.getPublicProfile(note.user),
        }));
    }

    async getGameUserPreliminaryResults(gameId: number, userId: number): Promise<PreliminaryResults> {
        const targetUserIds = (await this.prismaClient.participant.findMany({
            where: { gameId, userId: { not: userId } },
            include: { user: true }
        })).map(participant => participant.user.id);
        
        const notes = (await this.getUserNotes(userId)).filter(note => targetUserIds.includes(note.targetUserId));
        const likes = await this.getGameUserLikes(gameId, userId);
        
        const publicProfiles = (await this.prismaClient.user.findMany({ where: { id: { in: targetUserIds } } })).map(this.userService.getPublicProfile);

        return {
            likes,
            notes,
            participatedUsers: publicProfiles
        }
    }



}