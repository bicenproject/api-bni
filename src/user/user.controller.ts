import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Req,
  UseGuards,
  BadRequestException,
  ConflictException,
  HttpStatus,
  NotFoundException,
  Param,
  Delete,
} from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { CreateUserDto } from './dtos/create.user.dto';
import { UpdateUserDto } from './dtos/update.user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllUsers(@Req() request: Request) {
    try {
      const result = await this.userService.getAllUser();
      return {
        status: 'Ok!',
        message: 'Successfully fetch data!',
        result: result,
      };
    } catch (err) {
      throw new BadRequestException({
        status: 'Error',
        message: 'Internal Server Error!',
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req) {
    const userId = req.user.userId;
    const user = await this.userService.getUserWithRole(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      status: 'success',
      message: 'User profile retrieved successfully',
      result: user,
    };
  }

  @Post()
  async createUser(@Req() req, @Body() createUserDto: CreateUserDto) {
    try {
      const result = await this.userService.createUser(createUserDto);
      return {
        status: 'Ok!',
        message: 'Successfully created user!',
        result: result,
      };
    } catch (err) {
      console.error('Error in createUser:', err);
      if (err instanceof ConflictException) {
        throw new ConflictException({
          status: 'Error',
          message: err.message,
        });
      }
      if (err instanceof BadRequestException) {
        throw new BadRequestException({
          status: 'Error',
          message: err.message,
        });
      }
      throw new BadRequestException({
        status: 'Error',
        message: 'Internal Server Error!',
        details: err.message,
      });
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateUser(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    try {
      const userId = req.user.userId;
      const result = await this.userService.updateUser(userId, updateUserDto);
      return {
        status: 'Ok!',
        message: 'Successfully updated user!',
        result: result,
      };
    } catch (err) {
      console.error('Error in updateUser:', err);
      if (err instanceof ConflictException) {
        throw new ConflictException({
          status: 'Error',
          message: err.message,
        });
      }
      if (err instanceof BadRequestException) {
        throw new BadRequestException({
          status: 'Error',
          message: err.message,
        });
      }
      throw new BadRequestException({
        status: 'Error',
        message: 'Internal Server Error!',
        details: err.message,
      });
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Param('id') id: string) {
    try {
      const userId = parseInt(id, 10); // Convert the id to an integer
      if (isNaN(userId)) {
        throw new BadRequestException('Invalid user ID'); // Handle invalid ID
      }
      const result = await this.userService.deleteUser(userId);
      return {
        status: 'Ok!',
        message: 'Successfully deleted user!',
        result: result,
      };
    } catch (err) {
      console.error('Error in deleteUser:', err);
      throw new BadRequestException({
        status: 'Error',
        message: 'Internal Server Error!',
        details: err.message,
      });
    }
  }
}