import nodeMailer from 'nodemailer';
import { RejectionEmailInterface } from '../interface/Email';

export class SendRejectionEmail implements RejectionEmailInterface{


  async sendRejectionDoctorEmail(email: string, rejectedReason: string): Promise<any> {
    // Log environment variables for debugging
    console.log("Sender Email:", process.env.EMAIL_ACCOUNT);
    console.log("Recipient Email:", email);

    // Validate the recipient email
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      throw new Error("Invalid recipient email address");
    }

    const transporter = nodeMailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_ACCOUNT,
        pass: process.env.ACCOUNT_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const sendRejectionEmail = async (
      toEmail: string,
      rejectionReason: string
    ) => {
      const mailOptions = {
        from: process.env.EMAIL_ACCOUNT, // Sender email
        to: toEmail, // Recipient email
        subject: 'Important: Document Rejection Notification from HealthX',
        text: `Dear Doctor,\n\nThank you for submitting your documents to HealthX. Upon careful review, we regret to inform you that your documents (Medical License and Degree Certificate) have been rejected.\n\nReason for Rejection: ${rejectionReason}\n\nWe kindly request you to re-upload valid documents for further verification.\n\nIf you need any assistance, please contact us at support@healthx.com.\n\nThank you for your understanding.\n\nBest Regards,\nThe HealthX Team`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f7f7f7; text-align: center;">
            <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; max-width: 600px; margin: auto;">
              <h2 style="color: #E53E3E;">Document Rejection Notice</h2>
              <p style="font-size: 1.1em;">Dear Doctor,</p>
              <p>Thank you for submitting your documents to <strong>HealthX</strong>. Upon review, we regret to inform you that your documents (Medical License and Degree Certificate) have been rejected.</p>
              
              <div style="margin: 20px 0; padding: 15px; background-color: #ffe0e0; color: #D32F2F; border: 1px solid #f5c2c2; border-radius: 4px;">
                <strong>Reason for Rejection:</strong> ${rejectionReason}
              </div>

              <p>Please re-upload valid documents at your earliest convenience for further verification.</p>

              <p>If you have any questions or need assistance, feel free to contact our support team at 
                <a href="mailto:support@healthx.com" style="color: #E53E3E;">support@healthx.com</a>.
              </p>

              <br>
              <p>Thank you for your understanding.</p>

              <p style="font-weight: bold;">The HealthX Team</p>
            </div>
          </div>
        `,
      };

      try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Rejection email sent successfully: ${info.response}`);
        return info;
      } catch (error: any) {
        console.error('Error sending rejection email:', error);
        throw new Error(`Failed to send rejection email: ${error.message}`);
      }
    };

    await sendRejectionEmail(email, rejectedReason);
  }
}
