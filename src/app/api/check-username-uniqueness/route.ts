import dbconnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import z from "zod";
import { usernameValidation } from "@/schemas/signUpSchema"


const usernamequerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {
    await dbconnect()
    try {
        const { searchParams } = new URL(request.url)
        const QueryURL = { username: searchParams.get("username") }
        const result = usernamequerySchema.safeParse(QueryURL)
        console.log(result);



        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                message: usernameErrors?.length > 0 ? usernameErrors.join(', ') : "Invalid query Parameters"
            }, { status: 400 })
        }

        const { username } = result.data

        const usernameisVerified = await UserModel.findOne({
            username,
            isVerified: true
        })

        if (usernameisVerified) {
            return Response.json({
                success: false,
                message: "Username is already taken",
            }, { status: 409 })
        }

        return Response.json({
            success: true,
            message: "Username is unique",
        }, { status: 200 })

    } catch (error: any) {
        console.error("Error occuring in username", error);
        return Response.json({
            success: false,
            message: "Internal server error"
        }, { status: 500 })

    }
}