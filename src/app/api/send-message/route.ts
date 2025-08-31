import dbconnect from "@/lib/dbConnect";
import UserModel, { Message } from "@/model/User.model";

export async function POST(request: Request) {
    await dbconnect()
    const { username, content } = await request.json()
    console.log(content);
    
    try {
        const user = await UserModel.findOne({ username })
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 })
        }
        
        if (!user.isAcceptingMessage) {
            return Response.json({
                success: false,
                message: "User is not accepting message"
            }, { status: 500 })
        }

        const newMessage = { content, createdAt: new Date() }
        user.messages.push(newMessage as Message)
        await user.save()

        return Response.json({
            success: true,
            message: "Message send successfully"
        }, { status: 200 })

    } catch (error: any) {
        console.error("An unexpected error ocurr is sending message", error);

        return Response.json({
            success: false,
            message: "Internal Server error"
        }, { status: 500 })
    }
}