/**
 * Professional HTML Email Wrapper for V-Retail
 * Provides a consistent, luxury brand aesthetic for all official communications.
 */
export const mailTemplate = ({ title, content, footerText = "" }) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap');
        
        body {
            font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f8f9fa;
            color: #1a1a2e;
        }
        .wrapper {
            max-width: 600px;
            margin: 40px auto;
            background: #ffffff;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0,0,0,0.05);
            border: 1px solid #f0f0f0;
        }
        .header {
            background: #06061a;
            padding: 40px;
            text-align: center;
        }
        .logo {
            font-size: 28px;
            font-weight: 900;
            letter-spacing: -1px;
            color: #ffffff;
            text-decoration: none;
        }
        .logo span {
            color: #7b68ee;
            font-style: italic;
        }
        .content {
            padding: 40px;
            line-height: 1.6;
            font-size: 16px;
        }
        .title {
            font-size: 24px;
            font-weight: 900;
            margin-bottom: 20px;
            color: #06061a;
            letter-spacing: -0.5px;
        }
        .footer {
            background: #fdfdfd;
            padding: 30px;
            text-align: center;
            font-size: 12px;
            color: #94a3b8;
            border-top: 1px solid #f1f5f9;
        }
        .button {
            display: inline-block;
            padding: 14px 32px;
            background: #7b68ee;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 700;
            margin-top: 20px;
            box-shadow: 0 10px 20px rgba(123, 104, 238, 0.2);
        }
        .divider {
            height: 1px;
            background: #f1f5f9;
            margin: 30px 0;
        }
        .brand-badge {
            display: inline-block;
            padding: 4px 12px;
            background: rgba(123, 104, 238, 0.1);
            color: #7b68ee;
            border-radius: 8px;
            font-size: 10px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 15px;
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="header">
            <a href="#" class="logo">V<span>RETAIL</span></a>
        </div>
        <div class="content">
            <div class="brand-badge">Official Communication</div>
            <h1 class="title">${title}</h1>
            ${content}
            <div class="divider"></div>
            <p style="font-size: 14px; color: #64748b;">If you have any questions, our support masterpiece team is ready at <a href="mailto:retail.support.in@gmail.com" style="color: #7b68ee;">retail.support.in@gmail.com</a></p>
        </div>
        <div class="footer">
            <p>© ${new Date().getFullYear()} V-Retail by Vaibhav Dhotre. All rights reserved.</p>
            <p>${footerText}</p>
        </div>
    </div>
</body>
</html>`;
};
