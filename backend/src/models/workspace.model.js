import { model, Schema } from "mongoose";
import { generateInviteCode } from "../utils/uuid.js";

const workspaceSchema = new Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    description:{
        type:String,
        required:false,
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    inviteCode:{
        type:String,
        required:true,
        unique:true,
        default:generateInviteCode, 
    }
},{
    timestamps:true,
});

workspaceSchema.methods.resetInviteCode = function (){
    this.inviteCode = generateInviteCode();
}

const Workspace = model("Workspace",workspaceSchema);

export default Workspace;