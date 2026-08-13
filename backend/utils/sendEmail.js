const nodemailer = require("nodemailer");

const sendEmail = async (email, token, template) => {
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const data = await resend.emails.send({
      from: "PayPulse <no-reply@waleedimran.me>",
      to: email,
      subject: "Verify your email",
      html: `${template}`,
    });

    console.log("Email Sent Successfully:", data);
    return data;
  } catch (err) {
    console.error("EMAIL SENDING ERROR:", err);
    throw err;
  }
};

module.exports = sendEmail;
