import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaClient, User, UserAuth } from "@prisma/client";
import { TOKEN_LIFETIME } from '../../config/app.config';
const sha1 = require('sha1');

// declare function sha1(str: string): string
@Injectable()
export default class AuthService {
    constructor(private readonly prismaClient: PrismaClient) { }

    async registerUser(email: string, password: string): Promise<{user: User, auth: UserAuth}> {

        const user: User = await this.prismaClient.user.create({
            data: {
                email,
            }})
        
        const auth: UserAuth = await this.prismaClient.userAuth.create({
            data: {
                userId: user.id,
                passwordHash: this.getPasswordHash(password),
                token: this.generateToken(),
                expiry: new Date(new Date().getTime() + TOKEN_LIFETIME),
            }})
        
        return { user, auth }
    }

    async signIn(email: string, password: string): Promise<{user: User, auth: UserAuth} | null> {
        const user: User = await this.prismaClient.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
        }

        const auth: UserAuth = await this.prismaClient.userAuth.findFirst({
            where: {
                userId: user.id,
                passwordHash: this.getPasswordHash(password),
            },
        });

        if (!auth) {
            throw new HttpException('Invalid password', HttpStatus.FORBIDDEN);
        }

        const updatedAuth: UserAuth = await this.prismaClient.userAuth.update({
            where: {
                id: auth.id,
            },
            data: {
                token: this.generateToken(),
                expiry: new Date(new Date().getTime() + TOKEN_LIFETIME),
            },
        });

        return {user, auth: updatedAuth};

    }

    async getUserByToken(token: string): Promise<User | null> {
        const auth: UserAuth = await this.prismaClient.userAuth.findFirst({
            where: {
                token,
                expiry: {
                    gt: new Date(),
                },
            },
        });

        if (!auth) {
            throw new HttpException('Invalid token', HttpStatus.FORBIDDEN);
        }
        
        return this.prismaClient.user.findFirst({ where: { id: auth.userId } });
        
    }

    getPasswordHash(password: string): string {
        return sha1(password);
    }

    generateToken(): string {
        return sha1((new Date().getTime() * Math.random()).toString());
    }
}