import { SetMetadata } from '@nestjs/common';

/**
 * Role decorator. User only match one in list roles.
 * @param roles
 * @constructor
 */
export const RequireRoles = (...roles: Array<string>) => SetMetadata("roles", roles);