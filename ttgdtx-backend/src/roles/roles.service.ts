import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Role } from './schemas/role.schema';
import { Model } from 'mongoose';
import { CreateRoleDto } from './dto/role.dto';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role.name) private RoleModel: Model<Role>) {}

  async createRole(role: CreateRoleDto) {
    const filter = { name: role.name };
    const update = { $set: role };
    const options = { upsert: true, new: true };

    return this.RoleModel.findOneAndUpdate(filter, update, options);
  }

  async getRoleById(roleId: string) {
    return this.RoleModel.findById(roleId);
  }
}
