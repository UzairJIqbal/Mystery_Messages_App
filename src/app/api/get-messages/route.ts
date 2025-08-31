import UserModel from "@/model/User.model";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import dbconnect from "@/lib/dbConnect";
import { error } from "console";


export async function GET(request: Request) {
    await dbconnect()
    const session = await getServerSession(authOptions)


    const user: User = session?.user as User

    if (!session || !user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 500 })
    }

    const userId = new mongoose.Types.ObjectId(user._id)

    try {
        const user = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: {path :'$messages' , preserveNullAndEmptyArrays : true} },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } }

        ])

       


        if (!user || user.length === 0) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 500 })
        }
        return Response.json({
            success: true,
            message: "User found",
            messages: user[0].messages || "No Matches found"
        }, { status: 200 })
    } catch (error: any) {
        console.error("Errror occurs in getting message", error);
        return Response.json({
            success: false,
            message: "Errror occurs in getting messages"
        }, { status: 500 })

    }
}