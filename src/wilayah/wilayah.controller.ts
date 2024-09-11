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
import { CreateWilayahDto } from './dtos/create.wilayah.dto';
import { UpdateWilayahDto } from './dtos/update.wilayah.dto';

@Controller('api')
export class WilayahController {
  constructor(private readonly wilayahService: WilayahService) {}

  @Get('wilayah')
  async getAllWilayah() {
    const data = await this.wilayahService.getAllWilayah();
    if (!data) throw new BadRequestException('Wilayah does not exist');
    return {
      message: 'Data Wilayah',
      ...data,
    };
  }

  @Get('wilayah/:id')
  async getWilayahById(@Param('id', ParseIntPipe) id: number) {
    const WilayahFound = await this.wilayahService.getWilayahById(Number(id));
    if (!WilayahFound) throw new BadRequestException('Wilayah does not exist');
    return WilayahFound;
  }

  @Post('wilayah/create')
  async createWilayah(@Body() data: CreateWilayahDto) {
    try {
      const create = await this.wilayahService.createWilayah(data);
      return {
        message: 'Success create Wilayah',
        data: create,
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to create wilayah: ${error.message}`,
      );
    }
  }

  
@Put('wilayah/update/:id')
async updateWilayah(
  @Param('id') id: string,
  @Body() data: UpdateWilayahDto,
) {
  console.log('Received update request for wilayah:', id);
  console.log('Update data:', data);
  try {
    const update = await this.wilayahService.updateWilayah(Number(id), data);
    console.log('Update result:', update);
    return {
      message: 'success update',
      data: update,
    };
  } catch (error) {
    console.error('Error updating wilayah:', error);
    throw new BadRequestException('Failed to update wilayah: ' + error.message);
  }
}

  @Delete('wilayah/delete/:id')
  async deleteWilayah(@Param('id') id: string) {
    try {
      const deletes = await this.wilayahService.deleteWilayah(Number(id));
      return {
        message: 'Success Delete',
        ...deletes,
      };
    } catch (error) {
      throw new BadRequestException('Wilayah does not exist');
    }
  }
}
