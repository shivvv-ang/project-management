import { Schema, model } from "mongoose";
import { providerEnum } from "../enum/account-provider.enum.js";

const accountSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    provider: {
        type: String,
        enum: Object.values(providerEnum),
        required: true,
    },
    providerId: {
        type: String,
        required: true,
        unique: true,
    },
    refreshToken: {
        type: String,
        default: null
    },
    tokenExpiry: {
        type: Date,
        default: null
    }
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            delete ret.refreshToken;
            return ret;
        }
    }
});

const Account = model("Account", accountSchema);
export default Account;