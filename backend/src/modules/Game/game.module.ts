import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { EventsModule } from '../Event/events.module';
import { UserModule } from '../User/User.module';
import { PrismaClient } from '@prisma/client';
import AuthService from '../User/Auth.service';
import GameResultService from './gameResult.service';

@Module({
  imports: [EventsModule, UserModule],
  controllers: [GameController],
  providers: [GameService, PrismaClient, AuthService, GameResultService]
})
export class GameModule {}
