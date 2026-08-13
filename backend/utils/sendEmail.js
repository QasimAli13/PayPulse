const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (options) => {
  try {
    const data = await resend.emails.send({
      from: "PayPulse <onboarding@resend.dev>", // Resend default test domain
      to: options.email || options.to,
      subject: options.subject,
      html: options.html || options.text,
    });

    return data;
  } catch (error) {
    console.error("Resend Email Error:", error);
    throw error;
  }
};

module.exports = sendEmail;