const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  family: 4,
  connectionTimeout: 10000,
});
const sendEmail = async (options) => {
  const mailOptions = {
    from: `PayPulse <${process.env.EMAIL_USER}>`,
    to: options.email || options.to,
    subject: options.subject,
    html: options.html || options.text,
  };

  const info = await transporter.sendMail(mailOptions);

  return info;
};

module.exports = sendEmail;
