import dbconnect from "@/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User.model";
import { User } from "next-auth"
import { getServerSession } from "next-auth";


export async function POST(request: Request) {
    await dbconnect()
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not authenticated"
        }, { status: 401 })
    }
    const userId = user?._id
    const { acceptMessages } = await request.json()

    try {
        const UpdateUser = await UserModel.findByIdAndUpdate(
            userId, { isAcceptingMessage: acceptMessages }, { new: true }
        )

        if (!UpdateUser) {
            return Response.json({
                success: false,
                message: "Failed to Update User Status to accept Messages"
            }, { status: 401 })
        }

        return Response.json({
            success: true,
            message: "Message acceptance status updated successfully",
            UpdateUser
        }, { status: 200 })

    } catch (error: any) {
        return Response.json({
            success: false,
            message: "Failed to Update User Status to accept Messages"
        }, { status: 500 })
    }


}

export async function GET(request: Request) {
    await dbconnect()
    const session = await getServerSession(authOptions)
    const user = session?.user
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticate"
        }, { status: 401 })
    }
    try {
        const userId = user?._id
        const foundUser = await UserModel.findById(userId)
        if (!foundUser) {
            return Response.json({
                success: false,
                message: "Failed to find User to Update Messages"
            }, { status: 404 })
        }
        return Response.json({
            success: true,
            isAcceptingMessages : foundUser.isAcceptingMessage
        }, { status: 200 })

    } catch (error : any) {
        return Response.json({
            success: false,
            message: "Error in getting messages acceptance"
        }, { status: 500 })
    }

}