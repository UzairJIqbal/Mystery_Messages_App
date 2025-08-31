import { Resend } from "resend";
import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../emails/VerificationEmailTemplate";

export async function sendVerificationEmail(
  email: string,
  username: string,
  VerifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Mystry Code || Verification Code",
      react: VerificationEmail({ username, otp: VerifyCode }),
    });

    return { success: true, message: "Verification Email Send Successfully" };
  } catch (errorEmail) {
    console.log("Error Sending Verification Email");
    return { success: false, message: "Failed to send Verification Email" };
  }
}
