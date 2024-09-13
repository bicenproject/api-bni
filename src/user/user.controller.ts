import { Controller, Get, Post, Body, Req, UseGuards, BadRequestException, ConflictException, HttpStatus, NotFoundException } from "@nestjs/common";  
import { Request } from 'express';  
import { UserService } from "./user.service";  
import { JwtAuthGuard } from "../auth/guards/auth.guard";  
import { CreateUserDto } from "./dtos/create.user.dto";  

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
        result: result  
      };  
    } catch (err) {  
      throw new BadRequestException({  
        status: 'Error',  
        message: 'Internal Server Error!'  
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
      result: user 
    };  
  }  

  @Post()  
  @UseGuards(JwtAuthGuard)  
  async createUser(@Body() createUserDto: CreateUserDto) {  
    try {  
      const result = await this.userService.createUser(createUserDto);  
      return {  
        status: 'Ok!',  
        message: 'Successfully created user!',  
        result: result  
      };  
    } catch (err) {  
      console.error('Error in createUser:', err);  
      if (err instanceof ConflictException) {  
        throw new ConflictException({  
          status: 'Error',  
          message: err.message  
        });  
      }  
      if (err instanceof BadRequestException) {  
        throw new BadRequestException({  
          status: 'Error',  
          message: err.message  
        });  
      }  
      throw new BadRequestException({  
        status: 'Error',  
        message: 'Internal Server Error!',  
        details: err.message  
      });  
    }  
  }  
}