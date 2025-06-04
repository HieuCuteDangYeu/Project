import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthenticationGuard } from './guards/authentication.guard';
import { Permissions } from './decorators/permissions.decorator';
import { Resource } from './roles/enums/resource.enum';
import { Action } from './roles/enums/action.enum';
import { AuthorizationGuard } from './guards/authorization.guard';
import mongoose from 'mongoose';

interface AuthenticatedRequest extends Request {
  userId: mongoose.Types.ObjectId;
}
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Controller('/products')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Permissions([
    { resource: Resource.products, actions: [Action.read, Action.create] },
    { resource: Resource.settings, actions: [Action.read] },
  ])
  @Get()
  someProtectedRoute(@Req() req: AuthenticatedRequest) {
    return { message: 'Accessed Resource', userId: req.userId };
  }
}
