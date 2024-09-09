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
import { GroupWilayahService } from './group_wilayah.service';
import { Group_Wilayah } from '@prisma/client';
import { CreateGroupWilayahDto, UpdateGroupWilayahDto } from './dtos/group.dto';

@Controller('api')
export class GroupWilayahController {
  constructor(
    private readonly group_getAllGroup_Wilayahervice: GroupWilayahService,
  ) {}

  @Get('getGrupWilayah')
  async getAllGroup_Wilayah() {
    const data =
      await this.group_getAllGroup_Wilayahervice.getAllGroup_Wilayah();
    if (!data) throw new BadRequestException('Group_Wilayah does not exist');
    return {
      message: 'Data Wilayah',
      ...data,
    };
  }

  @Get('getGrupWilayah/:id')
  async getGroup_WilayahById(@Param('id', ParseIntPipe) id: number) {
    const Group_WilayahFound =
      await this.group_getAllGroup_Wilayahervice.getGroup_WilayahByid_group(
        Number(id),
      );
    if (!Group_WilayahFound)
      throw new BadRequestException('Group_Wilayah does not exist');
    return Group_WilayahFound;
  }

  @Post('getGrupWilayah/create')
  async createTask(@Body() data: CreateGroupWilayahDto) {
    const create =
      await this.group_getAllGroup_Wilayahervice.createGroup_Wilayah(data);
    return {
      message: 'succes create Group_Wilayah',
      ...create,
    };
  }

  @Put('getGrupWilayah/update/:id')
  async updateGroup_Wilayah(
    @Param('id') id: string,
    @Body() data: UpdateGroupWilayahDto,
  ) {
    try {
      const update =
        await this.group_getAllGroup_Wilayahervice.updateGroup_Wilayah(
          Number(id),
          data,
        );
      return {
        message: 'success update',
        ...update,
      };
    } catch (error) {
      throw new BadRequestException('Group_Wilayah does not exist');
    }
  }

  @Delete('getGrupWilayah/delete/:id')
  async deleteGroup_Wilayah(@Param('id') id: string) {
    try {
      const deletes =
        await this.group_getAllGroup_Wilayahervice.deleteGroup_Wilayah(
          Number(id),
        );
      return {
        message: 'Success Delete',
        ...deletes,
      };
    } catch (error) {
      throw new BadRequestException('Group_Wilayah does not exist');
    }
  }
}
