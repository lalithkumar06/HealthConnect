
const nodemailer = require("nodemailer");
const agenda = require("./agenda");

agenda.define("send appointment email", async (job) => {
  const { to, subject, text } = job.attrs.data;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user:process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: 'HealthConnect',
    to,
    subject,
    text,
  });
});
