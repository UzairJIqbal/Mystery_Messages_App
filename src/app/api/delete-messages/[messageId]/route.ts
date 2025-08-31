import dbconnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function DELETE(request: Request , {params} : {params : {messageId : string}}) {
    const messageID = params.messageId
    await dbconnect()
    const session = await getServerSession(authOptions)


    const user: User = session?.user as User

    

    if (!session || !user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 500 })
    }
 
    try {
       const UpdateMessage = await UserModel.updateOne(
            {_id: user._id},
            {$pull : {messages : {_id : messageID}}}
        )
      
        if (UpdateMessage.matchedCount === 0) {
            return Response.json({
                success: false,
                message: "Message not found or already Deleted"
            }, { status: 404 })
        }

        return Response.json({
            success: true,
            message: "Message deleted Successfully"
        }, { status: 200 })
    } catch (error) {
        console.error("An unexpected error ocurr in deleting message", error);

        return Response.json({
            success: false,
            message: "Internal Server error"
        }, { status: 500 })
    }
}
