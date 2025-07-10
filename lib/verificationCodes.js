import nodemailer from 'nodemailer';

export async function sendVerificationEmail({
  email,
  code,
  provider: { server, from },
}) {
  const transport = nodemailer.createTransport(server);
  
  try {
    const result = await transport.sendMail({
      to: email,
      from,
      subject: `Your Verification Code`,
      text: `Your verification code is: ${code}\n\nThis code will expire in 10 minutes.\n\nIf you did not request this code, you can safely ignore this email.`,
      html: `
        <body>
          <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
            <h2 style="text-align: center; text-transform: uppercase;color: teal;">SAGAI - Email Verification</h2>
            <p>Please use the verification code below to complete your registration:</p>
            <div style="text-align: center; background-color: #f4f4f4; padding: 15px; font-size: 24px; letter-spacing: 5px; font-weight: bold; color: #333;">
              ${code}
            </div>
            <p style="margin-top: 20px;">This code will expire in 10 minutes.</p>
            <p>If you didn't request this code, you can safely ignore this email.</p>
            <p style="margin-top: 20px; font-style: italic; text-align: center; color: #888;">
              If you haven't received the code or it has expired, you can request a new one from the verification page.
            </p>
          </div>
            <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p style="color: #888; font-size: 90%;">
                &copy; ${new Date().getFullYear()} SAGAI. All rights reserved.
              </p>
            </div>
          </div>
        </body>
      `,
    });
    
    console.log('Verification code email sent successfully');
    return { success: true };
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('SEND_VERIFICATION_EMAIL_ERROR');
  }
}