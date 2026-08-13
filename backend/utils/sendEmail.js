// Line 1: Resend ko sahi tareeqay se require karein
const { Resend } = require("resend");

const sendEmail = async (email, token) => {
  // Line 2: Resend instance banayein
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const data = await resend.emails.send({
      from: "LUXE STORE <no-reply@waleedimran.me>",
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
