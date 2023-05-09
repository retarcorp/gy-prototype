import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { PrismaClient } from '@prisma/client';
import { AuthGuard } from '../User/Auth.guards';
import AuthService from '../User/Auth.service';

@Module({
    imports: [],
    controllers: [EventsController],
    providers: [EventsService, PrismaClient, AuthService],
})
export class EventsModule {}
