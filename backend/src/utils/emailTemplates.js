
export const generateOTPTemplate = (name, otp) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verification Code</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f4f7f9;
                margin: 0;
                padding: 0;
                color: #333;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                background: #ffffff;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            }
            .header {
                background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
                padding: 30px;
                text-align: center;
                color: white;
            }
            .content {
                padding: 40px;
                text-align: center;
            }
            .otp-code {
                font-size: 36px;
                font-weight: bold;
                letter-spacing: 5px;
                color: #6366f1;
                background: #f0f4ff;
                padding: 15px 30px;
                border-radius: 8px;
                display: inline-block;
                margin: 20px 0;
                border: 2px dashed #6366f1;
            }
            .footer {
                background: #f9fafb;
                padding: 20px;
                text-align: center;
                font-size: 12px;
                color: #6b7280;
            }
            .btn {
                display: inline-block;
                padding: 12px 24px;
                background-color: #6366f1;
                color: white;
                text-decoration: none;
                border-radius: 6px;
                font-weight: 600;
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Verify Your Account</h1>
            </div>
            <div class="content">
                <p>Hi ${name || 'User'},</p>
                <p>Thank you for joining us! Please use the following code to verify your email address. This code will expire in 10 minutes.</p>
                <div class="otp-code">${otp}</div>
                <p>If you didn't request this code, you can safely ignore this email.</p>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Your App Name. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

export const generateWelcomeTemplate = (name) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Our Community</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f4f7f9;
                margin: 0;
                padding: 0;
                color: #333;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                background: #ffffff;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            }
            .header {
                background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
                padding: 40px;
                text-align: center;
                color: white;
            }
            .content {
                padding: 40px;
                text-align: left;
                line-height: 1.6;
            }
            .welcome-image {
                width: 100%;
                max-height: 200px;
                object-fit: cover;
                border-radius: 8px;
                margin-bottom: 20px;
            }
            .footer {
                background: #f9fafb;
                padding: 20px;
                text-align: center;
                font-size: 12px;
                color: #6b7280;
            }
            .cta-button {
                display: block;
                width: 200px;
                margin: 30px auto;
                padding: 15px;
                background-color: #10b981;
                color: white;
                text-align: center;
                text-decoration: none;
                border-radius: 8px;
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Welcome Aboard! 🚀</h1>
            </div>
            <div class="content">
                <h2>Hello ${name},</h2>
                <p>We're absolutely thrilled to have you join our community! You've successfully created your account and you're now ready to explore everything we have to offer.</p>
                <p>Whether you're here to learn, connect, or grow, we're committed to providing you with the best experience possible.</p>
                <a href="#" class="cta-button">Get Started Now</a>
                <p>If you have any questions or need assistance, feel free to reply to this email. Our team is always here to help!</p>
                <p>Cheers,<br>The Team</p>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Your App Name. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};
