const nodemailer = require("nodemailer");
require("dotenv").config();
const { getBaseUrl } = require("./BaseUrl");
const currentBaseUrl = getBaseUrl();
const { htmlContent } = require("../Emailservice/VerifyEmail");

const sendVerificationEmail = async (email, token, username) => {
  try {
    const verificationLink = `${currentBaseUrl}/auth/account_verification/${token}`;

    // Create a transporter object using Gmail's SMTP server
    const transporter = nodemailer.createTransport({
      service: "gmail", // Use Gmail's SMTP service
      auth: {
        user: process.env.GMAIL_USER, // Your Gmail email
        pass: process.env.GMAIL_PASS, // Your Gmail app password
      },
    });

    const subject = "Verify Your Email Address";

    // Call htmlContent with username and verificationLink
    const message = htmlContent(username, verificationLink);

    // Send the email
    await transporter.sendMail({
      from: process.env.GMAIL_USER, // Sender's email (use the same email as the user)
      to: email, // Recipient's email
      subject, // Subject of the email
      // text: `Hi ${username}, please verify your email by visiting ${verificationLink}`, // Plain text version
      html: message, // HTML version of the message
    });

    console.log("Verification email sent successfully!");
    return {
      isSuccess: true,
      message: "Verification email sent successfully.",
    };
  } catch (error) {
    console.error("Error sending verification email:", error);
    return { isSuccess: false, message: "Failed to send verification email." };
  }
};

module.exports = { sendVerificationEmail };
