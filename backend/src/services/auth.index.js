import mongoose from "mongoose";
import User from "../models/user.model.js";
import Account from "../models/account.model.js";
import Workspace from "../models/workspace.model.js";
import { Roles } from "../enum/role-permission.enum.js";
import Role from "../models/roles-permissions.model.js";
import Member from "../models/member.model.js";
import { BadRequestException, NotFoundException, UnAuthorizedException } from "../utils/appError.js";
import { providerEnum } from "../enum/account-provider.enum.js";

export const loginOrCreatAccountService = async (data) => {
    const { provider, displayName, providerId, picture, email } = data;
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        let user = await User.findOne({ email }).session(session);

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

            const ownerRole = await Role.findOne({ name: Roles.OWNER }).session(session);

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

        const safeUser = user.omitPassword?.() ?? user;

        await session.commitTransaction();

        return { safeUser };

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    } finally {
        session.endSession();
    }
}

export const registerUserService = async (data) => {
    const { email, name, password } = data;
    const session = await mongoose.startSession();

    try {

        session.startTransaction();

        const existingUser = await User.findOne({ email }).session(session);

        if (existingUser) {
            throw new BadRequestException("Email already exists");
        }

        const user = new User({
            email,
            name,
            password,
        });

        const account = new Account({
            userId: user._id,
            provider: providerEnum.EMAIL,
            providerId: email,
        });

        await account.save({ session });

        const workspace = new Workspace({
            name: "My Workspace",
            description: `Workspace created for ${user.name}`,
            owner: user._id,
        });

        await workspace.save({ session });

        const ownerRole = await Role.findOne({ name: Roles.OWNER }).session(session);

        if (!ownerRole) {
            throw new NotFoundException("Owner role not found");
        }

        const member = new Member({
            userId: user._id,
            workspace: workspace._id,
            role: ownerRole._id,
            joinedAt: new Date(),
        });

        await member.save({ session });

        user.currentWorkspace = workspace._id;

        await user.save({ session });

        await session.commitTransaction();

        return { userId: user._id, workspace: workspace._id };

    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};


export const verifyUserService = async (
    { email, password }
) => {

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        throw new NotFoundException("User Not Found");
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        throw new UnAuthorizedException("Invalid Credentials");
    }

    return user.omitPassword?.() ?? user;
}