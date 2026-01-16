import { Schema, model } from "mongoose";
import { compareValue, hashValue } from "../utils/bcrypt.js";

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: { type: String, select: true },
    profilePicture: {
        type: String,
        default: null,
    },
    currentWorkspace: {
        type: Schema.Types.ObjectId,
        ref: "Workspace",
    },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date, default: null }
}, { timestamps: true });

userSchema.pre("save", async function () {
    if (this.isModified("password")) {
        if (this.password) {
            this.password = await hashValue(this.password);
        }
    }
})

userSchema.methods.omitPassword = function () {
    const userObject = this.toObject();
    delete userObject.password;
    return userObject;
}

userSchema.methods.comparePassword = async function (password) {
    return compareValue(password, this.password);
}

const User = model("User",userSchema);
export default User;
