const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transpoter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const mailOptions = {
    from: `"PayPulse Banking" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };
  await transpoter.sendMail(mailOptions);
};
module.exports = sendEmail;
