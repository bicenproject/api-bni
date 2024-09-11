import { Controller, Get, Post, Body, Req, Res, UseGuards, BadRequestException, ConflictException } from "@nestjs/common";
import { Request, Response } from 'express';
import { UserService } from "./user.service";
import { JwtAuthGuard } from "../auth/guards/auth.guard";
import { CreateUserDto } from "./dtos/create.user.dto";

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllUsers(@Req() request: Request, @Res() response: Response): Promise<any> {
    try {
      const result = await this.userService.getAllUser();
      return response.status(200).json({
        status: 'Ok!',
        message: 'Successfully fetch data!',
        result: result
      });
    } catch (err) {
      return response.status(500).json({
        status: 'Error',
        message: 'Internal Server Error!'
      });
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createUser(@Body() createUserDto: CreateUserDto, @Res() response: Response): Promise<any> {
    try {
      const result = await this.userService.createUser(createUserDto);
      return response.status(201).json({
        status: 'Ok!',
        message: 'Successfully created user!',
        result: result
      });
    } catch (err) {
      console.error('Error in createUser:', err);
      if (err instanceof ConflictException) {
        return response.status(409).json({
          status: 'Error',
          message: err.message
        });
      }
      if (err instanceof BadRequestException) {
        return response.status(400).json({
          status: 'Error',
          message: err.message
        });
      }
      return response.status(500).json({
        status: 'Error',
        message: 'Internal Server Error!',
        details: err.message
      });
    }
  }
}