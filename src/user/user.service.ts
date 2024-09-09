
import { User } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { ConflictException, Injectable, BadRequestException } from "@nestjs/common";
import { CreateUserDto } from "./dtos/create.user.dto";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAllUser(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async createUser(data: CreateUserDto): Promise<User> {
    const { email, username, npp } = data;

    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username },
          { npp }
        ]
      }
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new ConflictException('Email already exists');
      }
      if (existingUser.username === username) {
        throw new ConflictException('Username already exists');
      }
      if (existingUser.npp === npp) {
        throw new ConflictException('NPP already exists');
      }
    }

    try {
      return await this.prisma.user.create({
        data: {
          ...data,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });
    } catch (error) {
      throw new BadRequestException('Failed to create user');
    }
  }
}
