import bcrypt from "bcryptjs";
import dbconnect from "@/lib/dbConnect";
import { success } from "zod";
import { NextResponse } from "next/server";
import UserModel from "@/model/User.model";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";



export async function POST(request: Request) {
  await dbconnect();
  try {
    const requestBody = await request.json();
    const { username, email, password } = requestBody;


    const existingUserisVerified = await UserModel.findOne({
      username,
      isVerified: true,
    });



    if (existingUserisVerified) {
      return Response.json(
        {
          message: "Username is already taken used another one",
          success: false,
        },
        { status: 400 }
      );
    }
    const existingUserbyemail = await UserModel.findOne({ email });
    const VerifyCode = Math.floor(1000 + Math.random() * 9000).toString();
    if (existingUserbyemail) {
      if (existingUserbyemail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User is already existed with this email",
          },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserbyemail.password = hashedPassword;
        existingUserbyemail.VerifyCode = VerifyCode;
        existingUserbyemail.VerifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserbyemail.save()
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        VerifyCode,
        VerifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: false,
        messages: [],
      });

      await newUser.save();
    }

    const emilResponse = await sendVerificationEmail(
      email,
      username,
      VerifyCode
    );

    if (!emilResponse.success) {
      console.warn("Email failed:", emilResponse.message);
      return Response.json(
        {
          success: false,
          message: emilResponse.message,
        },
        { status: 200 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "User registered Successfully Pleas Verify Your Email",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error occurs in Registering user", error);
    return Response.json(
      {
        success: false,
        message: "Error Registering User",
      },
      {
        status: 500,
      }
    );
  }
}
