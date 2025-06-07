import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailService: MailerService) {}

  async sendPasswordResetEmail(to: string, token: string) {
    const resetLink = `http://localhost:3000/reset-password?token=${token}`;

    const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; min-height: 100vh;">
            <tr>
                <td align="center" style="padding: 40px 20px;">
                    <!-- CNN Logo -->
                    <div style="background-color: #cc0000; color: white; font-size: 48px; font-weight: bold; padding: 8px 20px; border-radius: 4px; margin-bottom: 40px; letter-spacing: 2px; display: inline-block;">
                        CNN
                    </div>
                    
                    <!-- Main Content Box -->
                    <table width="500" cellpadding="0" cellspacing="0" style="background-color: white; border-radius: 8px; max-width: 500px;">
                        <tr>
                            <td style="padding: 60px 40px; text-align: center;">
                                <!-- Title -->
                                <div style="font-size: 28px; color: #333; margin-bottom: 40px; font-weight: normal; line-height: 1.3;">
                                    You requested to reset your password.
                                </div>
                                
                                <!-- Reset Button -->
                                <div style="margin-bottom: 30px;">
                                    <a href="${resetLink}" style="background-color: #333; color: white; text-decoration: none; padding: 12px 24px; font-size: 16px; border-radius: 4px; display: inline-block; font-weight: normal;">
                                        Reset Password
                                    </a>
                                </div>
                                
                                <!-- Info Text -->
                                <div style="color: #333; font-size: 14px; line-height: 1.5; margin-bottom: 20px;">
                                    This password reset is only valid for the next 30 minutes. If you didn't make this request, please ignore this email.
                                </div>
                                
                                <!-- Disclaimer -->
                                <div style="color: #999; font-size: 12px; line-height: 1.4; margin-top: 10px;">
                                    This email was sent from a notification-only address that cannot accept incoming email.<br>
                                    Please do not reply to this message.
                                </div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            
            <!-- Footer -->
            <tr>
                <td style="background-color: #1a1a1a; color: #ccc; text-align: center; padding: 20px; font-size: 12px;">
                    © 2025 Cable News Network Inc, a Warner Bros. Discovery Company. All Rights Reserved.
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;

    const mailOptions = {
      from: 'TTGDTX Huyen Tuy Duc',
      to: to,
      subject: 'Password Reset Request',
      html: htmlTemplate,
    };

    await this.mailService.sendMail(mailOptions);
  }
}
