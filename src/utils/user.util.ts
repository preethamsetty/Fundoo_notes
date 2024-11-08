import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.USER,
    pass: process.env.PASSWORD,
  },
});

const sendEmail = async (to: string, token: string) => {
  const mailOptions = {
    from: {
      name: 'Fundoo Notes',
      address: process.env.USER,
    },
    to: ["preethambstest@gmail.com"],
    subject: "Password Reset Token",
    html: `<p>Your password reset token is:</p><p><strong>${token}</strong></p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export { sendEmail };
