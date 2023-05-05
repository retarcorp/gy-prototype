import { Module } from '@nestjs/common';
import { UserController } from './User.controller';
import { PrismaService } from 'src/utils/prisma.service';


@Module({
  imports: [],
  controllers: [UserController],
  providers: [PrismaService],
})
export class UserModule {}
