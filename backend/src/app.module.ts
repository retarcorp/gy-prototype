import { Module } from '@nestjs/common';
import { UserModule } from './modules/User/User.module';
import { EventsModule } from './modules/Event/events.module';

@Module({
  imports: [UserModule, EventsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
