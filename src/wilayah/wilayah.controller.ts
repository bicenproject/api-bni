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
  import { Wilayah } from '@prisma/client';
import { WilayahService } from './wilayah.service';
  
  @Controller('api')
  export class WilayahController {
    constructor(
      private readonly wilayahService: WilayahService,
    ) {}
  
    @Get('wilayah')
    async getAllWilayah() {
      const data =
        await this.wilayahService.getAllWilayah();
      if (!data) throw new BadRequestException('Wilayah does not exist');
      return {
        message: 'Data Wilayah',
        ...data,
      };
    }
  
    @Get('wilayah/:id')
    async getWilayahById(@Param('id', ParseIntPipe) id: number) {
      const WilayahFound =
        await this.wilayahService.getWilayahById(
          Number(id),
        );
      if (!WilayahFound)
        throw new BadRequestException('Wilayah does not exist');
      return WilayahFound;
    }
  
    @Post('wilayah/create')
    async createTask(@Body() data: Wilayah) {
      const create =
        await this.wilayahService.createWilayah(data);
      return {
        message: 'succes create Wilayah',
        ...create,
      };
    }
  
    @Put('wilayah/update/:id')
    async updateWilayah(
      @Param('id') id: string,
      @Body() data: Wilayah,
    ) {
      try {
        const update =
          await this.wilayahService.updateWilayah(
            Number(id),
            data,
          );
        return {
          message: 'success update',
          ...update,
        };
      } catch (error) {
        throw new BadRequestException('Wilayah does not exist');
      }
    }
  
    @Delete('wilayah/delete/:id')
    async deleteWilayah(@Param('id') id: string) {
      try {
        const deletes =
          await this.wilayahService.deleteWilayah(
            Number(id),
          );
        return {
          message: 'Success Delete',
          ...deletes,
        };
      } catch (error) {
        throw new BadRequestException('Wilayah does not exist');
      }
    }
  }
  