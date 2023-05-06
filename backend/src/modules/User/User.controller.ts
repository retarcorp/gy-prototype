import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { User as UserModel } from '@prisma/client';
import { PrismaService } from 'src/utils/prisma.service';
import { UserService } from './User.service';

@Controller()
export class UserController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
    ) {}

  @Get('/users/hello')
  async getHello(): Promise<UserModel[]> {
    return await this.prismaService.user.findMany({})
  }

  @Post('/users/')
  async registerUser(@Body('email') email: string, @Body('password') password: string): Promise<UserModel | any> {
    
    return this.userService.registerUser(email, password);
  }

  @Post('/users/signin')
  async signIn(@Body('email') email: string, @Body('password') password: string): Promise<any> {
    return this.userService.signIn(email, password);
  }
}
