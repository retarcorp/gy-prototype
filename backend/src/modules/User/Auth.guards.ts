import { CallHandler, CanActivate, ExecutionContext, Injectable, NestInterceptor, UseGuards, UseInterceptors, applyDecorators, createParamDecorator } from "@nestjs/common";
import { Request } from "express";
import AuthService from "./Auth.service";
import { User } from "@prisma/client";
import { Reflector } from "@nestjs/core";
import { SetMetadata } from '@nestjs/common';
import { Observable } from "rxjs";


@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        protected readonly authService: AuthService,
        protected reflector: Reflector
    ) { }

    async canActivate(context: any): Promise<boolean> {
        const request: Request & { currentUser?: User } = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;
        if (!authHeader) {
            return false;
        }
                
        const [bearer, token] = authHeader.split(' ');
        const user: User = await this.authService.getUserByToken(token);

        if (user) {
            const isAdminRequired = this.reflector.get('isAdmin', context.getHandler());
            if (isAdminRequired) {
                return user.isAdmin;
            }
            return true;
        }

        return false;
    }
}

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
    constructor(
        protected readonly authService: AuthService,
    ) { }

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const request: Request & { currentUser?: User } = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        if (!authHeader) {
            return next.handle();
        }
        const [bearer, token] = authHeader.split(' ');
        const user: User = await this.authService.getUserByToken(token);

        if (user) {
            request.currentUser = user;
        }
        return next.handle();
    }
}

export const WithAuth = () => applyDecorators(
    UseInterceptors(CurrentUserInterceptor),
    UseGuards(AuthGuard),
)

export const AdminOnly = () => applyDecorators(
    SetMetadata('isAdmin', true),
    WithAuth()
);

export const CurrentUser = createParamDecorator((data: unknown, context: ExecutionContext & { currentUser: unknown }) => {
    const request: Request & { currentUser?: User } = context.switchToHttp().getRequest();
    return request.currentUser || null;
})