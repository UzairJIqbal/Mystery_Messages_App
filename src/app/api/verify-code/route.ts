import dbconnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";



export async function POST(request: Request) {
    await dbconnect()
    try {
        const reqBody = await request.json()
        const {username, code} = reqBody
        const decodedUsername = decodeURIComponent(username)

        const user = await UserModel.findOne({ username: decodedUsername })
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 })
        }
        const isCodeValid = user.VerifyCode === code
        const isCodenotexpired = new Date(user.VerifyCodeExpiry) > new Date()

        if (isCodeValid && isCodenotexpired) {
            user.isVerified = true
            await user.save()
            return Response.json({
                success: true,
                message: "Account Verified Successfully"
            }, { status: 200 })
        } else if (!isCodeValid) {
            return Response.json({
                success: false,
                message: "The Code you entered is not Valid"
            }, { status: 400 })
        } else if (!isCodenotexpired) {
            return Response.json({
                success: true,
                message: "Your Code is expired please sign up again to get a new code"
            }, { status: 500 })
        } else {
            return Response.json({
                success: true,
                message: "There is an error occurs in Code Validation and Code Expiry"
            }, { status: 500 })
        }

    } catch (error: any) {
        console.error("The following error is here :", error);

        return Response.json({
            success: false,
            message: "Error occurs in verifying User"
        }, { status: 500 })
    }
}