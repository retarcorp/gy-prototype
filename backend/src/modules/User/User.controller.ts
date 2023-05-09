import { Body, Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post } from '@nestjs/common';
import { User, User as UserModel } from '@prisma/client';
import { PrismaService } from 'src/utils/prisma.service';
import { UserService } from './User.service';
import { AdminOnly, CurrentUser, WithAuth } from './Auth.guards';

@Controller()
export class UserController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
  ) { }

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
    try {
      return this.userService.signIn(email, password);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.FORBIDDEN);
    }
  }

  @Post('/users/:id/onboarding')
  @WithAuth()
  async putOnboardingData(
    @Body() onboardingData: any,
    @Param('id', ParseIntPipe) userId: number,
    @CurrentUser('id') currentUserId: number
  ): Promise<UserModel | any> {

    if (currentUserId !== userId) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    return this.userService.putOnboardingData(userId, onboardingData);
  }

  @Get('/users/validate')
  @WithAuth()
  async validateAuth(@CurrentUser() user: User): Promise<any> {
    return { valid: true, user };
  }

  @Get('/admin/validate')
  @AdminOnly()
  async validateAdmin(@CurrentUser() user: User): Promise<any> {
    return { valid: true, user };
  }
}
