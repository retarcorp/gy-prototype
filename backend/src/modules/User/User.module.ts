import { Module } from '@nestjs/common';
import { UserController } from './User.controller';
import { PrismaService } from 'src/utils/prisma.service';
import { UserService } from './User.service';
import FirebaseService from 'src/utils/firebase.service';
import AuthService from './Auth.service';


@Module({
  imports: [],
  controllers: [UserController],
  providers: [PrismaService, UserService, AuthService],
})
export class UserModule {}
