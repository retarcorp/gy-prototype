import { Controller, Get } from '@nestjs/common';
import { User as UserModel } from '@prisma/client';
import { PrismaService } from 'src/utils/prisma.service';

@Controller()
export class UserController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get('/users/hello')
  async getHello(): Promise<UserModel[]> {
    return await this.prismaService.user.findMany({})
  }
}
