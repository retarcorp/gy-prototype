import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { PrismaClient } from '@prisma/client';
import { AuthGuard } from '../User/Auth.guards';
import AuthService from '../User/Auth.service';
import GameUtilsService from '../Game/gameUtils.service';
import GameResultService from '../Game/gameResult.service';
import { UserService } from '../User/User.service';

@Module({
    imports: [],
    controllers: [EventsController],
    providers: [EventsService, PrismaClient, UserService, AuthService, GameUtilsService, GameResultService],
})
export class EventsModule {}
