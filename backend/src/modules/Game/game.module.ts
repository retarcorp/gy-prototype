import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { EventsModule } from '../Event/events.module';
import { UserModule } from '../User/User.module';

@Module({
  imports: [EventsModule, UserModule],
  controllers: [GameController],
  providers: [GameService]
})
export class GameModule {}
