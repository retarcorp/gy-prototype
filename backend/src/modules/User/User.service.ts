import { HttpException, Injectable } from '@nestjs/common';
import { User as UserModel } from '@prisma/client';
import { PrismaService } from 'src/utils/prisma.service';
import AuthService from './Auth.service';

@Injectable()
export class UserService {

    constructor(private readonly prismaService: PrismaService,
        private readonly authService: AuthService
    ) { }

    getHello(): string {
        return 'Hello World!';
    }

    async registerUser(email: string, password: string): Promise<UserModel> {
        // return this.firebaseService.registerUser(email, password);
        return this.authService.registerUser(email, password);
    }

    async signIn(email: string, password: string): Promise<any> {
        return this.authService.signIn(email, password);
    }

    async putOnboardingData(userId: number, onboardingData: any): Promise<any> {
        
        return await this.prismaService.user.update({
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
}
