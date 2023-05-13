import { Module } from '@nestjs/common';
import { UserModule } from './modules/User/User.module';
import { EventsModule } from './modules/Event/events.module';
import { GameModule } from './modules/Game/game.module';

@Module({
  imports: [UserModule, EventsModule, GameModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
