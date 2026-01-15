import mongoose from "mongoose";
import User from "../models/user.model.js";
import Account from "../models/account.model.js";
import Workspace from "../models/workspace.model.js";
import { Roles } from "../enum/role-permission.enum.js";
import Role from "../models/roles-permissions.model.js";
import Member from "../models/member.model.js";


export const loginOrCreatAccountService = async (data) => {
    const { provider, displayName, providerId, picture, email } = data;
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        let user = User.findOne({ email }).session(session);

        if (!user) {
            user = new User({
                email,
                name: displayName,
                profilePicture: picture || null,
            });

            const account = new Account({
                userId: user._id,
                provider: provider,
                providerId: providerId
            });

            await account.save({ session });

            const workspace = new Workspace({
                name: "My Workspace",
                description: `Workspace created for ${user.name}`,
                owner: user._id,
            })

            await workspace.save({ session });

            const ownerRole = await Role.findOne({ name: Roles.OWNER }).session({ session });

            if (!ownerRole) {
                throw new NotFoundException("Owner role not found");
            }

            const member = new Member({
                userId: user._id,
                workspace: workspace._id,
                role: ownerRole._id,
                joinedAt: new Date()
            })

            await member.save({ session });

            user.currentWorkspace = workspace._id;
            await user.save({ session });
        }
        await session.commitTransaction();
        session.endSession();

        return { user };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    } finally {
        session.endSession();
    }
}