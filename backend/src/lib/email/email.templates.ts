export const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirm email</title>
</head>
<body style="font-family: Segoe UI; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #60a5fa, #1d4ed8); padding: 15px; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 1.6rem">Confirm your email address</h1>
  </div>
  <div style="background-color: #f9f9f9; text-align: center; padding: 10px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p style="font-size: 1.6rem; font-weight: bold">Welcome to Application</p>
    <p>Hello, thank you for joining us! Click the link below to confirm your email. </p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{verificationUrl}" style="background-color: #3b82f6; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Confirm email</a>
    </div>
    <p>This link will expire in 1 hour.</p>
    <p>If you didn't create an account with us, please ignore this email.</p>
    <p>Kind regards,<br>Application Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
    <p style="text-align: center;">© Goran Kitic, CEO</p>
  </div>
</body>
</html>
`;