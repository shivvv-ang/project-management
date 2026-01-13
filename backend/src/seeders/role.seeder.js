import "dotenv/config";
import mongoose from "mongoose";
import connectDb from "../configs/database.config.js";
import Role from "../models/roles-permissions.model.js";
import { RolePermissions } from "../utils/role-permission.js";

const seedRoles = async () => {
    await connectDb();

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        console.log("Clearing existing roles...");
        await Role.deleteMany({}, { session });

        for (const roleName of Object.keys(RolePermissions)) {
            const permissions = RolePermissions[roleName];

            const role = new Role({
                name: roleName,
                permissions,
            });

            await role.save({ session });
            console.log(`Role ${roleName} seeded`);
        }

        await session.commitTransaction();
        console.log("Roles seeded successfully");
    } catch (error) {
        await session.abortTransaction();
        console.error("Seeding failed:", error);
    } finally {
        session.endSession();
        process.exit(0);
    }
};

seedRoles();
