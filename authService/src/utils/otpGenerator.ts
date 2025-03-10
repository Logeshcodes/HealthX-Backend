import { otpGenerateInterface } from "@/Interface/otpGenerateInterface";

export class OtpGenerate implements otpGenerateInterface {
    
  async createOtpDigit(): Promise<string> {
    const digits = "0123456789";
    let OTP = "";
    const len = digits.length; // 10

    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * len);
      OTP += digits[randomIndex];
    }
    console.log(`OTP:===>${OTP}`);
    return OTP;
  }
}
