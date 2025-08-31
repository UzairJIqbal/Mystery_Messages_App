import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";

import UserModel from "@/model/User.model";
import dbconnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: {
                    label: "email",
                    type: "text",
                    placeholder: "Enter Your Email",
                },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials: any): Promise<any> {
                await dbconnect();
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { username: credentials.identifier },
                        ],
                    });
                    if (!user) {
                        throw new Error("User is not present with this email");
                    }
                    if (!user.isVerified) {
                        throw new Error("Please Verify your account first before login");
                    }
                    const isPasswordCorrect = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );
                    if (isPasswordCorrect) {
                        return user;
                    } else {
                        throw new Error("Incorrect password");
                    }
                } catch (error: any) {
                    console.error("This is the following error" , error);
                    
                    throw new Error(error);
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString()
                token.username = user.username
                token.isVerified = user.isVerified
                token.isAcceptingMessage = user.isAcceptingMessage
            }
            return token;
        },
        async session({ session, token}) {
            if (token) {
                session.user._id = token._id,
                session.user.username = token.username,
                session.user.isVerified = token.isVerified,
                session.user.isAcceptingMessage = token.isAcceptingMessage
            }
            return session;
        },
    },
    pages: {
        signIn: "/sign-in",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};
