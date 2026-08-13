const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (options) => {
  try {
    const data = await resend.emails.send({
      from: "PayPulse <onboarding@resend.dev>", 
      to: options.email || options.to,
      subject: options.subject,
      html: options.html || options.text,
    });

    console.log("Email Sent Successfully:", data);
    return data;
  } catch (error) {
    console.error("Resend Exact Error:", error);
    throw error;
  }
};

module.exports = sendEmail;
