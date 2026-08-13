const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (email, token) => {
  try {
    const data = await resend.emails.send({
      from: "PayPulse <no-reply@waleedimran.me>",
      to: email,
      subject: "Verify your email",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 25px; border: 1px solid #e7dcc9; border-radius: 12px; background-color: #ffffff;">
          <h2 style="color: #8b6b4a; text-align: center;">
            Welcome to PayPulse!
          </h2>

          <p style="color: #334155;">
            Thank you for creating an account with us.
          </p>

          <p style="color: #475569;">
            Use the verification token below to verify your email address:
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <div style="display: inline-block; background: #f6efe4; border: 2px dashed #b08968; color: #5c4430; padding: 14px 32px; font-size: 24px; font-weight: bold; letter-spacing: 3px; border-radius: 10px;">
              ${token}
            </div>
          </div>

          <p style="color: #64748b; font-size: 14px;">
            If you did not create this account, you can safely ignore this email.
          </p>
        </div>
      `,
    });

    console.log("Email sent successfully:", data);
    return data;
  } catch (error) {
    console.error("Email sending error:", error);
    throw error;
  }
};

module.exports = sendEmail;
