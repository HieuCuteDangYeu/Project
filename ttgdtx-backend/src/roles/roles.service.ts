import { CreateRoleDto } from './dto/role.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './schemas/role.schema';
import { Model, Types } from 'mongoose';
import { BaseService } from 'src/common/base.service';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService extends BaseService<RoleDocument> {
  constructor(@InjectModel(Role.name) private roleModel: Model<RoleDocument>) {
    super(roleModel);
  }

  protected async validateCreate(createDto: CreateRoleDto): Promise<void> {
    const existingRole = await this.roleModel
      .findOne({ name: createDto.name })
      .exec();

    if (existingRole) {
      throw new BadRequestException('Role with this name already exists');
    }

    const resourceSet = new Set();
    for (const permission of createDto.permissions) {
      if (resourceSet.has(permission.resource)) {
        throw new BadRequestException('Duplicate resource in permissions');
      }
      resourceSet.add(permission.resource);
    }
  }

  protected validateUpdate(
    id: Types.ObjectId,
    updateDto: UpdateRoleDto,
  ): Promise<void> {
    const resourceSet = new Set();
    if (updateDto?.permissions) {
      for (const permission of updateDto.permissions) {
        if (resourceSet.has(permission.resource)) {
          throw new BadRequestException('Duplicate resource in permissions');
        }
        resourceSet.add(permission.resource);
      }
    }
    return Promise.resolve();
  }
}
