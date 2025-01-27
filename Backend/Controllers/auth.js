const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const db = require("../db/db");
const { users, emailVerification, accounts } = require("../db");
const { eq } = require("drizzle-orm");
const { google } = require("googleapis");
const {
  create_verificationToken,
  Check_verification_token,
} = require("./token");
const { sendVerificationEmail } = require("../Action/EmailAction");
const { RegisterSchema, LoginSchema } = require("../types/UserSchema");
const { oauth2Client } = require("../utils/google.Config");
const cloudinary = require("../Action/cloudinary");

// Import the Zod schema

// Controller function for user registration
exports.registerUser = async (req, res) => {
  try {
    const validatedData = RegisterSchema.safeParse(req.body);

    // Check if validation was successful
    if (!validatedData.success) {
      return res.status(400).json({
        isSuccess: false,
        message: "Validation failed",
        errors: validatedData.error.errors,
      });
    }
    if (validatedData.success) {
      const { username, email, password } = validatedData.data;

      // Check if the google outh user already exists
      const existed_ACCOUNT = await db
        .select()
        .from(accounts)
        .where(eq(accounts.user_email, email));
      if (existed_ACCOUNT.length > 0) {
        return res.status(400).json({
          isSuccess: false,
          message: "The email account address you entered is already in use",
        });
      }
      //for normal user account
      const existed_userDoc = await db
        .select()
        .from(users)
        .where(eq(users.user_email, email));

      if (existed_userDoc.length > 0) {
        if (!existed_userDoc[0].emailVerified) {
          await db
            .delete(emailVerification)
            .where(eq(existed_userDoc[0].user_email, email));
          const verificationToken = await create_verificationToken(
            existed_userDoc[0].user_email
          );

          await sendVerificationEmail(
            verificationToken[0].user_email,
            verificationToken[0].verification_token,
            username
          );
          return res.status(200).json({
            isSuccess: true,
            message:
              "The email address you entered is not verified yet and email verification resent!!!",
          });
        }
        return res.status(400).json({
          isSuccess: false,
          message: "The email address you entered is already in use",
        });
      }
      //

      // Insert new user into the database

      // Hash the password before saving
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      await db.insert(users).values({
        user_name: username,
        user_email: email,
        user_password: hashedPassword,
        created_at: new Date(),
      });

      const verificationToken = await create_verificationToken(email);
      // console.log(verificationToken);
      // console.log("token", verificationToken[0].user_email);

      await sendVerificationEmail(
        verificationToken[0].user_email,
        verificationToken[0].verification_token,
        username
      );
      return res.status(200).json({
        isSuccess: true,
        message: "Verification email sent. ",
      });
      // Retrieve the current user (just inserted)
      // const currentUser = await db
      //   .select()
      //   .from(users)
      //   .where(eq(users.user_email, email));

      // // Respond with the new user details
      // return res.status(201).json({
      //   isSuccess: true,
      //   message: "User successfully registered",
      //   currentUser: currentUser[0],
      // });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      isSuccess: false,
      message: "An error occurred during registration",
    });
  }
};
///check verify email
exports.emailConfirmwithToken = async (req, res) => {
  const { token } = req.params;
  console.log(token);
  const existedToken = await Check_verification_token(null, token);
  console.log(existedToken);
  if (!existedToken || existedToken.length === 0) {
    return res.status(400).json({
      isSuccess: false,
      message: "Something went wrong with token",
    });
  }

  const isExpired = new Date() > new Date(existedToken[0].expires);
  if (isExpired) {
    return res.status(400).json({
      isSuccess: false,
      message: "Verification failed. Please try again.",
    });
  }

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.user_email, existedToken[0].user_email));
  if (!existingUser) {
    return res.status(400).json({
      isSuccess: false,
      message: "Something went wrong with user ",
    });
  }

  await db
    .update(users)
    .set({
      emailVerified: new Date(),
      email: existedToken.user_email,
    })
    .where(eq(users.user_id, existingUser[0].user_id));

  // delete after verified
  await db
    .delete(emailVerification)
    .where(
      eq(emailVerification.verification_id, existedToken[0].verification_id)
    );

  return res.status(200).json({
    isSuccess: true,
    message: "Your account has been successfully verified!",
  });
};

// Controller function for login
exports.LoginUser = async (req, res) => {
  try {
    const validatedData = LoginSchema.safeParse(req.body);

    if (!validatedData.success) {
      return res.status(400).json({
        isSuccess: false,
        message: "Validation failed",
        errors: validatedData.error.errors,
      });
    }
    if (validatedData.success) {
      const { email, password } = validatedData.data;

      const existed_GoogleLogin = await db
        .select()
        .from(users)
        .innerJoin(accounts, eq(users.user_email, accounts.user_email))
        .where(eq(users.user_email, email));
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.user_email, email));

      if (existingUser.length === 0 || existed_GoogleLogin.length > 0) {
        return res.status(400).json({
          isSuccess: false,
          message: "Invalid credentials",
        });
      }

      const isMatch = bcrypt.compare(password, existingUser[0].user_password);

      if (!isMatch) {
        return res.status(400).json({
          isSuccess: false,
          message: "Invalid credentials",
        });
      }

      if (!existingUser[0].emailVerified) {
        const verificationToken = await create_verificationToken(email);

        await sendVerificationEmail(
          verificationToken[0].user_email,
          verificationToken[0].verification_token,
          existingUser[0].user_name
        );
        return res.status(400).json({
          isSuccess: false,
          isunVerified: true,
          message: "Please verify your account first!!!",
        });
      }

      const JWT_token = jwt.sign(
        { userId: existingUser[0].user_id },
        process.env.JWT_KEY,
        { expiresIn: "1d" }
      );

      // Assign token for user in the database
      await db
        .update(users)
        .set({ user_token: JWT_token })
        .where(eq(users.user_email, email));

      return res.status(200).json({
        isSuccess: true,
        message: "Successfully Logged In",
        token: JWT_token,
        loginUser: existingUser[0],
      });
    }
  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      message: error.message,
    });
  }
};

exports.checkUser = async (req, res) => {
  const { userID } = req;

  try {
    const userDoc = await db
      .select()
      .from(users)
      .where(eq(users.user_id, userID));
    if (!userDoc) {
      return res.status(400).json({
        isSuccess: false,
        message: "Unauthorized user!!!",
      });
      // throw new Error("Unauthorized user!!!");
    }

    return res.status(200).json({
      isSuccess: true,
      message: "Authorized User",
      LoginUser: userDoc,
    });
  } catch (error) {
    return res.status(401).json({
      isSuccess: false,
      message: error,
    });
  }
};

exports.OauthLogin = async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) {
      return res.status(400).json({
        isSuccess: false,
        message: "Authorization code is required.",
      });
    }

    // Get Google OAuth tokens
    const googleResponse = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(googleResponse.tokens);

    // Use the token to get user info from Google
    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: "v2",
    });

    const userInfo = await oauth2.userinfo.get();
    const { id, email, name, picture } = userInfo.data;

    ////////////////
    ///check if user logged in with google already
    const existed_GoogleLogin = await db
      .select()
      .from(users)
      .innerJoin(accounts, eq(users.user_email, accounts.user_email))
      .where(eq(users.user_email, email));

    if (existed_GoogleLogin.length > 0) {
      const JWT_token = jwt.sign(
        { userId: existed_GoogleLogin[0].users.user_id },
        process.env.JWT_KEY,
        { expiresIn: "1d" }
      );
      return res.status(200).json({
        isSuccess: true,
        message: "Successfully logged in via Google",
        token: JWT_token,
        user: existed_GoogleLogin[0].users, // Send the user data as part of the response
      });
    }
    ////////////////////////////////
    // Check if user already exists

    if (existed_GoogleLogin.length === 0) {
      // If user with google login doesn't exist, create new user
      const newUser = {
        user_name: name,
        user_email: email,
        user_profileImage: picture,
        created_at: new Date(),
      };

      // Insert into users table
      await db.insert(users).values(newUser);

      const createdUser = await db
        .select()
        .from(users)
        .where(eq(users.user_email, email));

      // Insert into accounts table
      await db.insert(accounts).values({
        userId: createdUser[0].user_id,
        provider: "google",
        providerAccountId: id,
        access_token: googleResponse.tokens.access_token,
        refresh_token: googleResponse.tokens.refresh_token,
        id_token: googleResponse.tokens.id_token,
        token_type: googleResponse.tokens.token_type,
        expires_at: Math.floor(googleResponse.tokens.expiry_date / 1000),
        user_email: createdUser[0].user_email,
        scope: googleResponse.tokens.scope,
      });
      const JWT_token = jwt.sign(
        { userId: createdUser[0].user_id },
        process.env.JWT_KEY,
        { expiresIn: "1d" }
      );

      return res.status(200).json({
        isSuccess: true,
        message: "Successfully logged in via Google",
        token: JWT_token,
        user: createdUser[0], // Send the user data as part of the response
      });
    }
  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      message: error.message,
    });
  }
};

// Edit Profile
exports.editProfile = async (req, res) => {
  const { userID } = req; // Assuming userID is available from the JWT token
  const { username, currentPassword, newPassword, profilePicture } = req.body;

  try {
    // User Fetch
    const userDoc = await db
      .select()
      .from(users)
      .where(eq(users.user_id, userID));

    if (!userDoc || userDoc.length === 0) {
      return res
        .status(400)
        .json({ isSuccess: false, message: "User not found." });
    }

    // check the current password
    if (newPassword) {
      const isMatch = bcrypt.compare(currentPassword, userDoc[0].user_password);
      if (!isMatch) {
        return res
          .status(400)
          .json({
            isSuccess: false,
            message: "Current password is incorrect.",
          });
      }

      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update password
      await db
        .update(users)
        .set({ user_password: hashedPassword })
        .where(eq(users.user_id, userID));
    }

    // Profile Pic
    let updatedProfilePic = userDoc[0].user_profileImage;
    if (profilePicture) {
      const uploadResponse = await cloudinary.uploader.upload(profilePicture, {
        folder: "user_profiles",
      });
      updatedProfilePic = uploadResponse.secure_url;
    }

    // Update username and profile picture
    await db
      .update(users)
      .set({
        user_name: username || userDoc[0].user_name, // Only update if username is provided
        user_profileImage: updatedProfilePic,
      })
      .where(eq(users.user_id, userID));

    const updatedUser = await db
      .select()
      .from(users)
      .where(eq(users.user_id, userID));

    return res.status(200).json({
      isSuccess: true,
      updatedUser,
      message: "Profile updated successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      message: "An error occurred while updating the profile.",
    });
  }
};
