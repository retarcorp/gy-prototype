import { HttpException, Injectable } from '@nestjs/common';
import { PrismaClient, User, UserAuth, User as UserModel } from '@prisma/client';
import AuthService from './Auth.service';
import { PublicProfile } from 'src/types/game';

@Injectable()
export class UserService {

    constructor(private readonly PrismaClient: PrismaClient,
        private readonly authService: AuthService
    ) { }

    getHello(): string {
        return 'Hello World!';
    }

    async registerUser(email: string, password: string): Promise<{user: User, auth: UserAuth}> {
        // return this.firebaseService.registerUser(email, password);
        return this.authService.registerUser(email, password);
    }

    async signIn(email: string, password: string): Promise<any> {
        return this.authService.signIn(email, password);
    }

    async putOnboardingData(userId: number, onboardingData: any): Promise<any> {
        
        return await this.PrismaClient.user.update({
            where: {
                id: userId,
            },
            data: {
                phone: onboardingData.phone,
                name: onboardingData.name,
                nickname: onboardingData.nickname,
                aboutMe: onboardingData.aboutMe,
                contactsForLikes: onboardingData.contactsForLikes,
                contactsForMatches: onboardingData.contactsForMatches,
                onboardingCompleted: true,
                
            }
        })

    }

    getPublicProfileById(userId: number): Promise<PublicProfile> {
        return this.PrismaClient.user.findUnique({
            where: {
                id: userId
            }
        }).then(user => this.getPublicProfile(user));
    }

    getPublicProfile(user: UserModel, include: string[] = []): PublicProfile {
        const res = {
            id: user.id,
            name: user.name,
            nickname: user.nickname,
            aboutMe: user.aboutMe,
        }
        include.forEach(key => res[key] = user[key]);
        return res;
    }
}
