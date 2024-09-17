import { User } from "@prisma/client";  
import { PrismaService } from "../prisma/prisma.service";  
import { ConflictException, Injectable, BadRequestException } from "@nestjs/common";  
import { CreateUserDto } from "./dtos/create.user.dto";  
import { UpdateUserDto } from "./dtos/update.user.dto";  

@Injectable()  
export class UserService {  
  constructor(private prisma: PrismaService) {}  

  async getAllUser(): Promise<User[]> {  
    return this.prisma.user.findMany();  
  }  

  async getUserWithRole(userId: number) {  
    return this.prisma.user.findUnique({  
      where: { id_user: userId },  
      select: {  
        id_user: true,  
        username: true,  
        email: true,  
        role: {  
          select: {  
            name: true  
          }  
        }  
      }  
    });  
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
          dob: new Date(data.dob), // Pastikan ini adalah objek Date yang valid    
          created_at: new Date(),  
          updated_at: new Date(),  
          isVerified: false,  
          id_role: data.id_role || undefined,
          id_wilayah: data.id_wilayah || undefined,
          id_vendor: data.id_vendor || undefined,
          id_wilayah_vendor: data.id_wilayah_vendor || undefined,
          vendor_type: data.vendor_type || undefined,
        },  
      });  
    } catch (error) {  
      console.error('Prisma error:', error);  
      throw new BadRequestException(`Failed to create user: ${error.message}`);  
    }  
  }

  async updateUser(userId: number, data: UpdateUserDto): Promise<User> {  
    const { email, username, npp, dob, password, id_role, id_wilayah, id_vendor, id_wilayah_vendor, vendor_type, updated_by, isVerified } = data;  
  
    const existingUser = await this.prisma.user.findFirst({  
      where: {  
        id_user: {  
          not: userId  
        },  
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
      return await this.prisma.user.update({  
        where: {  
          id_user: userId  
        },  
        data: {  
          username,  
          email,  
          npp,  
          dob: dob ? new Date(dob) : null,  
          password,  
          id_role,  
          id_wilayah,  
          id_vendor,  
          id_wilayah_vendor,  
          vendor_type,  
          updated_at: new Date(),  
          updated_by,  
          isVerified  
        } ,
      });  
    } catch (error) {  
      console.error('Prisma error:', error);  
      throw new BadRequestException(`Failed to update user: ${error.message}`);  
    }  
  }  

  async deleteUser(userId: number): Promise<User> {  
    try {  
      return await this.prisma.user.delete({  
        where: {  
          id_user: userId  
        },  
      });  
    } catch (error) {  
      console.error('Prisma error:', error);  
      throw new BadRequestException(`Failed to delete user: ${error.message}`);  
    }  
  }  
}