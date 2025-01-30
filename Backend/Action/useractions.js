const nodemailer = require("nodemailer");
require("dotenv").config();

const {
  ActionEmail,
  activeEmail,
  removeAccountEmail,
} = require("../Emailservice/ActionEmail");

const sendRestrictionEmail = async (email) => {
  try {
    //     const verificationLink = `${currentBaseUrl}/auth/account_verification/${token}`;

    // Create a transporter object using Gmail's SMTP server
    const transporter = nodemailer.createTransport({
      service: "gmail", // Use Gmail's SMTP service
      auth: {
        user: process.env.GMAIL_USER, // Your Gmail email
        pass: process.env.GMAIL_PASS, // Your Gmail app password
      },
    });

    const subject = "Account restriction";

    // Call htmlContent with username and verificationLink
    const message = ActionEmail(email);

    // Send the email
    await transporter.sendMail({
      from: process.env.GMAIL_USER, // Sender's email (use the same email as the user)
      to: email, // Recipient's email
      subject, // Subject of the email
      // text: `Hi ${username}, please verify your email by visiting ${verificationLink}`, // Plain text version
      html: message, // HTML version of the message
    });

    console.log("Restriction email sent successfully!");
    return {
      isSuccess: true,
      message: "Restriction email sent successfully.",
    };
  } catch (error) {
    console.error("Error sending  email:", error);
    return { isSuccess: false, message: "Failed to send  email." };
  }
};

const sendActiveEmail = async (email) => {
  try {
    //     const verificationLink = `${currentBaseUrl}/auth/account_verification/${token}`;

    // Create a transporter object using Gmail's SMTP server
    const transporter = nodemailer.createTransport({
      service: "gmail", // Use Gmail's SMTP service
      auth: {
        user: process.env.GMAIL_USER, // Your Gmail email
        pass: process.env.GMAIL_PASS, // Your Gmail app password
      },
    });

    const subject = "Account Reactivation";

    // Call htmlContent with username and verificationLink
    const message = activeEmail(email);

    // Send the email
    await transporter.sendMail({
      from: process.env.GMAIL_USER, // Sender's email (use the same email as the user)
      to: email, // Recipient's email
      subject, // Subject of the email
      // text: `Hi ${username}, please verify your email by visiting ${verificationLink}`, // Plain text version
      html: message, // HTML version of the message
    });

    return {
      isSuccess: true,
      message: "Restriction email sent successfully.",
    };
  } catch (error) {
    return { isSuccess: false, message: "Failed to send  email." };
  }
};
const RemoveAccountEmail = async (email) => {
  try {
    //     const verificationLink = `${currentBaseUrl}/auth/account_verification/${token}`;

    // Create a transporter object using Gmail's SMTP server
    const transporter = nodemailer.createTransport({
      service: "gmail", // Use Gmail's SMTP service
      auth: {
        user: process.env.GMAIL_USER, // Your Gmail email
        pass: process.env.GMAIL_PASS, // Your Gmail app password
      },
    });

    const subject = "Account Deletion";

    // Call htmlContent with username and verificationLink
    const message = removeAccountEmail(email);

    // Send the email
    await transporter.sendMail({
      from: process.env.GMAIL_USER, // Sender's email (use the same email as the user)
      to: email, // Recipient's email
      subject, // Subject of the email
      // text: `Hi ${username}, please verify your email by visiting ${verificationLink}`, // Plain text version
      html: message, // HTML version of the message
    });

    return {
      isSuccess: true,
      message: "Account deletion email sent successfully.",
    };
  } catch (error) {
    return { isSuccess: false, message: "Failed to send  email." };
  }
};
module.exports = { sendRestrictionEmail, sendActiveEmail, RemoveAccountEmail };
