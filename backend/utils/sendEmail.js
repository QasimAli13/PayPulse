const { Resend } = require("resend");

const sendEmail = async (email, token) => {
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const data = await resend.emails.send({
      from: "PayPulse <no-reply@waleedimran.me>",
      to: email,
      subject: "Verify your email",
      html: `<p>Your verification token is: <strong>${token}</strong></p>`,
    });

    console.log("Email Sent Successfully:", data);
    return data;
  } catch (err) {
    console.error("EMAIL SENDING ERROR:", err);
    throw err;
  }
};

module.exports = sendEmail;