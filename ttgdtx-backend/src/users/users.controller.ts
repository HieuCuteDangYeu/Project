import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Types } from 'mongoose';
import { MongoIdPipe } from 'src/pipes/mongo-id.pipe';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(@Query() paginationQuery: PaginationQueryDto) {
    const { page = 1, limit = 10 } = paginationQuery;
    return this.usersService.findAll({ page, limit });
  }

  @Get(':id')
  findOne(@Param('id', MongoIdPipe) id: Types.ObjectId) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', MongoIdPipe) id: Types.ObjectId,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: Types.ObjectId) {
    return this.usersService.remove(id);
  }
}
