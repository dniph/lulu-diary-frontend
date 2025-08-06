"use server";

import { auth } from "@/lib/auth";

export const signUp = async (email, password, name) => {
    try {
        await auth.api.signUpEmail({
            body: {
                email,
                password,
                name
            },
            metadata: {
                name
            }
        });

        return {
            success: true,
            message: "Signed up successfully."
        }
    } catch (error) {
        const e = error;

        return {
            success: false,
            message: e.message || "An unknown error occurred."
        }
    }
}

export const signIn = async (email, password) => {
    try {
        await auth.api.signInEmail({
            body: {
                email,
                password
            }
        });

        return {
            success: true,
            message: "Signed in successfully."
        }
    } catch (error) {
        const e = error;

        return {
            success: false,
            message: e.message || "An unknown error occurred."
        }
    }
}