import { Injectable } from "@nestjs/common";
import { GameLike, GameStatus, GameUserResultRecord, PrismaClient, ResutlType, User, UserNotes } from "@prisma/client";
import { UserService } from "../User/User.service";
import { GameService } from "./game.service";
import { PreliminaryResults } from "src/types/game";
import GameUtilsService from "./gameUtils.service";

@Injectable()
export default class GameResultService {
    constructor(
        private readonly prismaClient: PrismaClient,
        private readonly userService: UserService,
        private readonly gameUtilsService: GameUtilsService,
    ) { }

    async setLike(gameId: number, userId: number, targetUserId: number, like: boolean): Promise<boolean> {
        const isValidParticipants = (await this.gameUtilsService.isUserParticipant(gameId, userId))
            && (await this.gameUtilsService.isUserParticipant(gameId, targetUserId));
        if (!isValidParticipants) {
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
        if (likes.length && like) return true;
        if (!likes.length && !like) return true;
        if (likes.length && !like) {
            // Removing like
            await this.prismaClient.gameLike.deleteMany({ where: { gameId, userId, targetUserId } });
            return false;
        }
        if (!likes.length && like) {
            // Adding like
            await this.prismaClient.gameLike.create({ data: { gameId, userId, targetUserId } });
        }
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

        return await Promise.all(notes.map(async note => ({
            ...note,
            targetUser: await this.userService.getPublicProfileById(note.targetUserId),
        })));
    }

    async getGameUserPreliminaryResults(gameId: number, userId: number): Promise<PreliminaryResults> {
        const targetUserIds = (await this.prismaClient.participant.findMany({
            where: { gameId, userId: { not: userId } },
            include: { user: true }
        })).map(participant => participant.user.id);

        const notes = (await this.getUserNotes(userId)).filter(note => targetUserIds.includes(note.targetUserId));
        const likes = await this.getGameUserLikes(gameId, userId);

        const publicProfiles = (await this.prismaClient.user.findMany({ where: { id: { in: targetUserIds } } })).map(v => this.userService.getPublicProfile(v));

        return {
            likes,
            notes,
            participatedUsers: publicProfiles
        }
    }

    async calculateGameResults(gameId: number): Promise<GameUserResultRecord[]> {
        // const users: User[] = (await this.prismaClient.participant.findMany({ where: { gameId }, include: { user: true } })).map(({ user }) => user);
        const likes: GameLike[] = await this.prismaClient.gameLike.findMany({ where: { gameId } });

        const results: Omit<GameUserResultRecord, "id">[] = likes.map(like => {
            const { userId, targetUserId } = like;
            const type: ResutlType = (likes.some(like => like.targetUserId === userId && like.userId === targetUserId)
                ? ResutlType.MATCH : ResutlType.LIKEDBY) as ResutlType;

            return {
                gameId,
                userId: targetUserId,
                targetUserId: userId,
                type
            }
        })

        await this.prismaClient.gameUserResultRecord.createMany({ data: results });
        const records = await this.prismaClient.gameUserResultRecord.findMany({ where: { gameId } });

        return records;
    }

    async getUserGameResults(userId: number, gameId: number): Promise<GameUserResultRecord[]> {
        const records = await this.prismaClient.gameUserResultRecord.findMany({ where: { gameId, userId }, include: { targetUser: true } });
        const recordTargets = records.map(record => record.targetUserId);
        const notes = await this.prismaClient.userNotes.findMany({ where: { userId, targetUserId: { in: recordTargets } } });

        return records.map(record => {
            const contactField = record.type === 'MATCH' ? 'contactsForMatches' : 'contactsForLikes';
            const contacts = this.userService.getPublicProfile(record.targetUser, [contactField])[contactField];
            return {
                ...record,

                targetUser: {
                    ...this.userService.getPublicProfile(record.targetUser),
                    contacts,
                    notes: notes.find(note => note.targetUserId === record.targetUserId)?.notes,
                }
            }
        });

    }



}