import { model, Schema } from "mongoose";

const projectSchema = new Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    emoji:{
        type:String,
        required:true,
        trim:false,
        default:"📊"
    },
    description:{
        type:String,
        required:false,
    },
    workspace:{
        type:Schema.Types.ObjectId,
        ref:"Workspace",
        required:true,
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
    }
},{timestamps:true});

const Project = model("Project",projectSchema);

export default Project;