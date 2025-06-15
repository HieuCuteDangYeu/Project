import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Types } from 'mongoose';
import { MongoIdPipe } from 'src/pipes/mongo-id.pipe';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { AuthorizationGuard } from 'src/guards/authorization.guard';
import { Action } from 'src/roles/enums/action.enum';
import { Resource } from 'src/roles/enums/resource.enum';
import { Permissions } from 'src/decorators/permissions.decorator';

@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Permissions([{ resource: Resource.users, actions: [Action.read] }])
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    const { page = 1, limit = 10 } = paginationQuery;
    return this.usersService.findAll({ page, limit });
  }

  @Get(':id')
  @Permissions([{ resource: Resource.users, actions: [Action.read] }])
  findOne(@Param('id', MongoIdPipe) id: Types.ObjectId) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Permissions([{ resource: Resource.users, actions: [Action.update] }])
  update(
    @Param('id', MongoIdPipe) id: Types.ObjectId,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Permissions([{ resource: Resource.users, actions: [Action.delete] }])
  remove(@Param('id', MongoIdPipe) id: Types.ObjectId) {
    return this.usersService.remove(id);
  }
}
