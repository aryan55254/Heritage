"use server";

import connectDB from "../../lib/db";
import { User } from "../models/User";
import { verifySession } from "../../lib/session";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function getUserDetails() {
    const session = await verifySession();
    if (!session || !session.userId) return null;

    await connectDB();
    const user = await User.findById(session.userId).select("name email");

    if (!user) return null;
    return {
        name: user.name,
        email: user.email,
    };
}

export async function updateUserDetails(formData: FormData) {
    const session = await verifySession();
    if (!session || !session.userId) {
        return { success: false, error: "Unauthorized" };
    }

    const name = formData.get("name") as string;
    const newPassword = formData.get("newPassword") as string;

    const dataToUpdate: any = { name };
    if (newPassword && newPassword.trim() !== "") {
        if (newPassword.length < 8) {
            return { success: false, error: "Password must be at least 8 chars" };
        }
        dataToUpdate.password = await bcrypt.hash(newPassword, 10);
    }

    try {
        await connectDB();
        await User.findByIdAndUpdate(session.userId, dataToUpdate);

        revalidatePath("/chat");
        return { success: true, message: "Profile updated successfully" };
    } catch (error) {
        console.error("Update error:", error);
        return { success: false, error: "Failed to update profile" };
    }
}