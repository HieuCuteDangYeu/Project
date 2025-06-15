import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Get,
  Query,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Types } from 'mongoose';
import { MongoIdPipe } from 'src/pipes/mongo-id.pipe';
import { PaginationQueryDto } from 'src/common/pagination-query.dto';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { AuthorizationGuard } from 'src/guards/authorization.guard';
import { Permissions } from 'src/decorators/permissions.decorator';
import { Action } from 'src/roles/enums/action.enum';
import { Resource } from 'src/roles/enums/resource.enum';

@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @Permissions([{ resource: Resource.roles, actions: [Action.create] }])
  create(@Body() role: CreateRoleDto) {
    return this.rolesService.create(role);
  }

  @Get()
  @Permissions([{ resource: Resource.roles, actions: [Action.read] }])
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    const { page = 1, limit = 10 } = paginationQuery;
    return this.rolesService.findAll({ page, limit });
  }

  @Get(':id')
  @Permissions([{ resource: Resource.roles, actions: [Action.read] }])
  findOne(@Param('id', MongoIdPipe) id: Types.ObjectId) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @Permissions([{ resource: Resource.roles, actions: [Action.update] }])
  update(
    @Param('id', MongoIdPipe) id: Types.ObjectId,
    @Body() role: UpdateRoleDto,
  ) {
    return this.rolesService.update(id, role);
  }

  @Delete(':id')
  @Permissions([{ resource: Resource.roles, actions: [Action.delete] }])
  remove(@Param('id', MongoIdPipe) id: Types.ObjectId) {
    return this.rolesService.remove(id);
  }
}
