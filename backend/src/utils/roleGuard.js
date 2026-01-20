import { UnAuthorizedException } from "./appError.js";
import { RolePermissions } from "./role-permission.js"

export const roleGuard = (role, requiredPermissions) => {
    
    const permissions = RolePermissions[role];

    const hasPermissions = requiredPermissions.every((permission) => permissions.includes(permission));

    if(!hasPermissions){
        throw new UnAuthorizedException("you do not have necessary permissions");
    }
}