import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
  } from '@nestjs/common';
  import { Vendor } from '@prisma/client';
import { VendorService } from './vendor.service';
import { CreateVendorDto, UpdateVendorDto } from './dtos/vendor.dto';
  
  @Controller('api')
  export class VendorController {
    constructor(
      private readonly vendorService: VendorService,
    ) {}
  
    @Get('vendor')
    async getAllVendor() {
      const data =
        await this.vendorService.getAllVendor();
      if (!data) throw new BadRequestException('Vendor does not exist');
      return {
        message: 'Data Wilayah',
        ...data,
      };
    }
  
    @Get('vendor/:id')
    async getVendorById(@Param('id', ParseIntPipe) id: number) {
      const VendorFound =
        await this.vendorService.getVendorByid(
          Number(id),
        );
      if (!VendorFound)
        throw new BadRequestException('Vendor does not exist');
      return VendorFound;
    }
  
    @Post('vendor/create')
    async createTask(@Body() data: CreateVendorDto) {
      const create =
        await this.vendorService.createVendor(data);
      return {
        message: 'succes create Vendor',
        ...create,
      };
    }
  
    @Put('vendor/update/:id')
    async updateVendor(
      @Param('id', ParseIntPipe) id: string,
      @Body() data: UpdateVendorDto,
    ) {
      try {
        const update =
          await this.vendorService.updateVendor(
            Number(id),
            data,
          );
        return {
          message: 'success update',
          ...update,
        };
      } catch (error) {
        throw new BadRequestException('Vendor does not exist');
      }
    }
  
    @Delete('vendor/delete/:id')
    async deleteVendor(@Param('id', ParseIntPipe) id: string) {
      try {
        const deletes =
          await this.vendorService.deleteVendor(
            Number(id),
          );
        return {
          message: 'Success Delete',
          ...deletes,
        };
      } catch (error) {
        throw new BadRequestException('Vendor does not exist');
      }
    }
  }
  