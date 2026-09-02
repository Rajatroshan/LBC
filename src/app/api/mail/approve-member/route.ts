import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { memberEmail, memberName, adminName } = body;

    if (!memberEmail) {
      return NextResponse.json(
        { error: 'memberEmail is required' },
        { status: 400 }
      );
    }

    const recipientName = memberName || 'Gram Sadasya';
    const approvedBy = adminName || 'Village Committee Admin';
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const loginUrl = `${siteUrl}/auth/login`;

    // Check if SMTP environment variables are configured
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM || `"LBC Mandap Committee" <${smtpUser || 'noreply@lbcmandap.in'}>`;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>LBC Mandap Account Approved</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FFFDF7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1C1917;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FFFDF7; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #FFFFFF; border: 2px solid #FCD34D; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #EA580C 0%, #D97706 50%, #16A34A 100%); padding: 30px 24px; text-align: center;">
              <div style="font-size: 40px; line-height: 1;">🪔</div>
              <h1 style="color: #FFFFFF; margin: 10px 0 4px 0; font-size: 26px; font-weight: 900; letter-spacing: -0.5px;">
                LBC Mandap
              </h1>
              <p style="color: #FEF3C7; margin: 0; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
                Village Chanda &amp; Mandap System • 100% Khula Hisab
              </p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 36px 32px;">
              <h2 style="color: #1C1917; font-size: 20px; font-weight: 800; margin-top: 0;">
                Namaste, ${recipientName} 🙏
              </h2>
              
              <div style="background-color: #ECFDF5; border-left: 4px solid #10B981; padding: 14px 18px; border-radius: 12px; margin: 20px 0;">
                <p style="color: #065F46; font-size: 15px; font-weight: 800; margin: 0;">
                  🎉 Subh Samachar! Your Registration Has Been Approved.
                </p>
              </div>

              <p style="color: #44403C; font-size: 15px; line-height: 1.6; margin: 16px 0;">
                Your account registration for <strong>LBC Mandap</strong> has been officially verified and activated by Admin <strong>${approvedBy}</strong>.
              </p>

              <p style="color: #44403C; font-size: 15px; line-height: 1.6; margin: 16px 0;">
                You can now log in to access the community portal, view your household festival subscriptions, explore the utsav calendar, record chanda payments, and view 100% transparent bahi-khata accounts.
              </p>

              <!-- CTA Button -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 30px 0 25px 0;">
                <tr>
                  <td align="center">
                    <a href="${loginUrl}" style="background: linear-gradient(135deg, #EA580C 0%, #D97706 100%); color: #FFFFFF; text-decoration: none; padding: 14px 34px; font-size: 16px; font-weight: 800; border-radius: 16px; display: inline-block; box-shadow: 0 4px 14px rgba(234, 88, 12, 0.4);">
                      Login to LBC Mandap →
                    </a>
                  </td>
                </tr>
              </table>

              <div style="background-color: #FFFBEB; border: 1px dashed #F59E0B; border-radius: 14px; padding: 14px 18px; text-align: center; margin-top: 25px;">
                <p style="color: #92400E; font-size: 12px; font-weight: 700; margin: 0;">
                  🌾 Gaon Ekta Sandesh: &ldquo;Mili-juli chanda se khilta gaon, 100% Khula Hisab.&rdquo;
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #FAFAF9; border-top: 1px solid #F5EBE0; padding: 20px 32px; text-align: center;">
              <p style="color: #78716C; font-size: 12px; margin: 0 0 6px 0;">
                Need help or have questions? Contact the Admin at 
                <a href="mailto:rajatroshan2002@gmail.com" style="color: #EA580C; font-weight: 700; text-decoration: none;">
                  rajatroshan2002@gmail.com
                </a>
              </p>
              <p style="color: #A8A29E; font-size: 11px; margin: 0;">
                © ${new Date().getFullYear()} LBC Mandap • Luhuren Village Puja Committee
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    if (smtpHost && smtpUser && smtpPass) {
      // Live SMTP available - send actual email
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: smtpFrom,
        to: memberEmail,
        subject: '🎉 Congratulations! Your LBC Mandap Account is Approved',
        html: htmlContent,
      });

      return NextResponse.json({
        success: true,
        delivered: true,
        message: `Approval email sent to ${memberEmail}`,
      });
    } else {
      // No live SMTP configured in environment - log cleanly and return success
      console.log(
        `[LBC Mail Service] Member Approved email auto-generated for: ${memberEmail} (${recipientName}) by Admin: ${approvedBy}. ` +
        `Login link: ${loginUrl}. To send live emails to the user's inbox, configure SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS in .env.local.`
      );

      return NextResponse.json({
        success: true,
        delivered: false,
        note: 'Email logged to server console (SMTP not configured in .env.local)',
        loginUrl,
      });
    }
  } catch (error) {
    console.error('Failed to process approval email:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}

