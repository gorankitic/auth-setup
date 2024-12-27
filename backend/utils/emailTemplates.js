exports.VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email verification</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #60a5fa, #1d4ed8); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Verify your email address</h1>
  </div>
  <div style="background-color: #f9f9f9; text-align: center; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p style="font-size: 1.6rem; font-weight: bold">Welcome to Application</p>
    <p>Hello, thank you for joining us! Your verification code is:</p>
    <div style="text-align: center; margin: 30px 0;">
      <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1d4ed8;">{verificationToken}</span>
    </div>
    <p>Enter this code on the verification page to complete your registration.</p>
    <p>This code will expire in 24 hours.</p>
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

exports.RESET_PASSWORD_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset your password</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #60a5fa, #1d4ed8); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Reset your password</h1>
  </div>
  <div style="text-align: center; background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello, we received a request to reset your password.<br> If you didn't make this request, please ignore this email.</p>
    <p>To reset your password, click the button:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{resetUrl}" style="background-color: #2563eb; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset password</a>
    </div>
    <p>This link will expire in 10 minutes.</p>
    <p>Kind regards,<br>Application Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
    <p style="text-align: center;">© Goran Kitic, CEO</p>
  </div>
</body>
</html>
`;