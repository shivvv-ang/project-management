import { model, Schema } from "mongoose";
import { generateTaskCode } from "../utils/uuid.js";
import { TaskPriorityEnum, TaskStatusEnum } from "../enum/task.enum.js";


const taskSchema = Schema({
    taskCode:{
        type:String,
        unique:true,
        default:generateTaskCode,
    },
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        trim:true,
        default:null,
    },
    project:{
        type:Schema.Types.ObjectId,
        ref:"Project",
        required:true,
    },
    workspace:{
        type:Schema.Types.ObjectId,
        ref:"Workspace",
        required:true,
    },
    status:{
        type:String,
        enum:Object.values(TaskStatusEnum),
        default:TaskStatusEnum.TODO
    },
    priority:{
        type:String,
        enum:Object.values(TaskPriorityEnum),
        default:TaskPriorityEnum.LOW
    },
    assignedTo:{
        type:Schema.Types.ObjectId,
        ref:"User",
        default:null,
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,  
    },
    dueDate:{
        type:Date,
        default:null,
    }
}, { timestamps: true });

const Task = model("Task",taskSchema);

export default Task;