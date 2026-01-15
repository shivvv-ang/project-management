import { model, Schema } from "mongoose";
import { Permissions, Roles } from "../enum/role-permission.enum.js";
import { RolePermissions } from "../utils/role-permission.js";


const roleSchema = new Schema({
    name:{
        type:String,
        enum:Object.values(Roles)
    },
    permissions:{
        type:[String],
        enum:Object.values(Permissions),
        required:true,
        default: function(){
            return RolePermissions[this.name];
        }
    },
}, { timestamps: true });


const Role = model("Role",roleSchema);

export default Role;