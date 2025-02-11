import nodeMailer from 'nodemailer';
import { ApprovalEmailInterface } from '../interface/Email';

export class SendApprovalEmail implements ApprovalEmailInterface {

  async sendApprovalDoctorEmail(email: string): Promise<any> {
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

    const sendApprovalEmail = async (toEmail: string) => {
      const mailOptions = {
        from: process.env.EMAIL_ACCOUNT, // Sender email
        to: toEmail, // Recipient email
        subject: 'Congratulations: Document Approval Notification from HealthX',
        text: `Dear Doctor,\n\nWe are delighted to inform you that your documents (Medical License and Degree Certificate) have been approved. Welcome to HealthX!\n\nYour application has been successfully approved, and you are now part of a network that strives to serve the community with care and compassion.\n\nThank you for joining us. Together, we will continue to serve people and ensure better healthcare.\n\nBest Regards,\nThe HealthX Team`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f7f7f7; text-align: center;">
            <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; max-width: 600px; margin: auto;">
              <h2 style="color: #2E8B57;">Document Approval Notice</h2>
              <p style="font-size: 1.1em;">Dear Doctor,</p>
              <p>We are delighted to inform you that your documents (Medical License and Degree Certificate) have been approved.</p>

              <div style="margin: 20px 0; padding: 15px; background-color: #e0ffe0; color: #2E8B57; border: 1px solid #b2f5b2; border-radius: 4px;">
                <strong>Welcome to HealthX!</strong> Your application has been successfully approved. We are excited to have you on board.
              </div>

              <p>Thank you for joining us. Together, we will continue to serve people and ensure better healthcare.</p>

              <br>
              <p>Warm Regards,</p>

              <p style="font-weight: bold;">The HealthX Team</p>
            </div>
          </div>
        `,
      };

      try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Approval email sent successfully: ${info.response}`);
        return info;
      } catch (error: any) {
        console.error('Error sending approval email:', error);
        throw new Error(`Failed to send approval email: ${error.message}`);
      }
    };

    await sendApprovalEmail(email);
  }
}
