import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from 'src/auth/auth.service';
import { Request } from 'express';
import { PERMISSIONS_KEY } from 'src/decorators/permissions.decorator';
import { Resource } from 'src/roles/enums/resource.enum';
import { Action } from 'src/roles/enums/action.enum';
import mongoose from 'mongoose';
interface RoutePermission {
  resource: Resource;
  actions: Action[];
}
interface AuthenticatedRequest extends Request {
  userId: mongoose.Types.ObjectId;
}

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    if (!request.userId) {
      throw new UnauthorizedException('User Id not found');
    }

    const routePermissions: RoutePermission[] =
      this.reflector.getAllAndOverride(PERMISSIONS_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

    try {
      const userPermissions = await this.authService.getUserPermissions(
        request.userId,
      );

      for (const routePermission of routePermissions) {
        const userPermission = userPermissions?.find(
          (perm) => perm.resource === routePermission.resource,
        );

        if (!userPermission) throw new ForbiddenException();

        const allActionsAvailable = routePermission.actions.every(
          (requiredAction: Action) =>
            userPermission.actions.includes(requiredAction),
        );
        if (!allActionsAvailable) throw new ForbiddenException();
      }
    } catch {
      throw new ForbiddenException();
    }

    return true;
  }
}
