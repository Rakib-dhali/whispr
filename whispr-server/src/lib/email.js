
import nodemailer from "nodemailer";

const welcomeHtml = (fullName) => `
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f0f0;padding:32px 0;">
  <tr><td align="center">
    <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
      <tr>
        <td style="background:#1a1a2e;padding:28px 36px 24px;">
          <table cellpadding="0" cellspacing="0"><tr>
            <td style="width:36px;height:36px;background:#6c63ff;border-radius:10px;text-align:center;vertical-align:middle;">
              <span style="color:#fff;font-size:18px;font-weight:700;line-height:36px;">W</span>
            </td>
            <td style="padding-left:12px;color:#ffffff;font-size:18px;font-weight:600;">Whispr</td>
          </tr></table>
        </td>
      </tr>
      <tr>
        <td style="padding:36px 36px 8px;">
          <p style="margin:0 0 8px;font-size:26px;font-weight:700;color:#1a1a2e;letter-spacing:-0.5px;">Welcome aboard! 🎉</p>
          <p style="margin:0;font-size:15px;color:#666;line-height:1.6;">Your account is ready. Start chatting instantly.</p>
        </td>
      </tr>
      <tr>
        <td style="padding:20px 36px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f7fb;border-radius:12px;">
            <tr><td style="padding:20px 24px;">
              <p style="margin:0 0 6px;font-size:12px;font-weight:600;color:#999;text-transform:uppercase;letter-spacing:0.8px;">Account created for</p>
              <p style="margin:0;font-size:16px;font-weight:600;color:#1a1a2e;">${fullName}</p>
            </td></tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 36px 28px;">
          <p style="margin:0 0 20px;font-size:14px;color:#555;line-height:1.7;">
            Hey <strong style="color:#1a1a2e;">${fullName}</strong>, you're all set to start messaging. Connect with friends, share moments, and enjoy seamless real-time chat.
          </p>
          <table cellpadding="0" cellspacing="0">
            <tr><td style="background:#6c63ff;border-radius:10px;">
              <a href="${process.env.CLIENT_URL || "#"}" style="display:block;padding:13px 28px;color:#fff;text-decoration:none;font-size:14px;font-weight:600;">Open Whispr →</a>
            </td></tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="border-top:1px solid #f0f0f0;padding:20px 36px;background:#fafafa;">
          <p style="margin:0;font-size:12px;color:#bbb;line-height:1.6;">
            You received this email because an account was created with this address.<br/>
            © ${new Date().getFullYear()} Whispr · All rights reserved
          </p>
        </td>
      </tr>
    </table>
  </td></tr>
</table>`;

const loginHtml = (fullName, loginTime) => `
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f0f0;padding:32px 0;">
  <tr><td align="center">
    <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
      <tr>
        <td style="background:#1a1a2e;padding:28px 36px 24px;">
          <table cellpadding="0" cellspacing="0"><tr>
            <td style="width:36px;height:36px;background:#6c63ff;border-radius:10px;text-align:center;vertical-align:middle;">
              <span style="color:#fff;font-size:18px;font-weight:700;line-height:36px;">W</span>
            </td>
            <td style="padding-left:12px;color:#ffffff;font-size:18px;font-weight:600;">Whispr</td>
          </tr></table>
        </td>
      </tr>
      <tr>
        <td style="padding:36px 36px 8px;">
          <p style="margin:0 0 8px;font-size:26px;font-weight:700;color:#1a1a2e;letter-spacing:-0.5px;">New sign-in detected</p>
          <p style="margin:0;font-size:15px;color:#666;line-height:1.6;">We noticed activity on your account.</p>
        </td>
      </tr>
      <tr>
        <td style="padding:20px 36px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff8f0;border-radius:12px;border:1px solid #ffe0b2;">
            <tr><td style="padding:20px 24px;">
              <p style="margin:0 0 2px;font-size:11px;font-weight:600;color:#f59e0b;text-transform:uppercase;letter-spacing:0.8px;">Account</p>
              <p style="margin:0 0 12px;font-size:14px;color:#1a1a2e;font-weight:500;">${fullName}</p>
              <p style="margin:0 0 2px;font-size:11px;font-weight:600;color:#f59e0b;text-transform:uppercase;letter-spacing:0.8px;">Time</p>
              <p style="margin:0;font-size:14px;color:#1a1a2e;font-weight:500;">${loginTime}</p>
            </td></tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 36px 28px;">
          <p style="margin:0 0 20px;font-size:14px;color:#555;line-height:1.7;">
            If this was you, no action needed. If you didn't sign in, change your password immediately.
          </p>
          <table cellpadding="0" cellspacing="0">
            <tr><td style="background:#dc2626;border-radius:10px;">
              <a href="${process.env.CLIENT_URL || "#"}" style="display:block;padding:13px 28px;color:#fff;text-decoration:none;font-size:14px;font-weight:600;">Secure my account →</a>
            </td></tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="border-top:1px solid #f0f0f0;padding:20px 36px;background:#fafafa;">
          <p style="margin:0;font-size:12px;color:#bbb;line-height:1.6;">
            You received this because a sign-in was detected on your account.<br/>
            © ${new Date().getFullYear()} Whispr · All rights reserved
          </p>
        </td>
      </tr>
    </table>
  </td></tr>
</table>`;
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
})

export const sendWelcomeEmail = async (to, fullName) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: to,
    subject: "Welcome to Whispr!",
    html: welcomeHtml(fullName),
  };

  await transporter.sendMail(mailOptions);
};

export const sendLoginEmail = async (to, fullName) => {
  const loginTime = new Date().toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: to,
    subject: "New sign-in to your Whispr account",
    html: loginHtml(fullName, loginTime),
  };
  
  await transporter.sendMail(mailOptions);
};
