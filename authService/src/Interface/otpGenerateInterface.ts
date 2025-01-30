export interface otpGenerateInterface {
    createOtpDigit(length?: number): Promise<string>;
  }
  