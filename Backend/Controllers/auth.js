const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const db = require("../db/db");
const { users } = require("../db");
const { eq } = require("drizzle-orm");

const {
  RegisterSchema,
  LoginSchema,
  AdminsAuthSchema,
  superAdminsAuthSchema,
  AdminsSchema,
} = require("../types/UserSchema");
const cloudinary = require("../Action/cloudinary");
const { and } = require("drizzle-orm");

// Import the Zod schema

// Controller function for user registration
exports.registerUser = async (req, res) => {
  const { role, username, password, token, email } = req.body;
  const schema = role === "admin" ? AdminsSchema : RegisterSchema;

  if (role === "admin") {
    if (!token || !email) {
      return res.status(400).json({
        isSuccess: false,
        message: "Invalid crendentials",
      });
    }
  }
  try {
    const validatedData = schema.safeParse(req.body);

    // Check if validation was successful
    if (!validatedData.success) {
      return res.status(400).json({
        isSuccess: false,
        message: "Validation failed",
        errors: validatedData.error.errors,
      });
    }

    const { role, username, password, token, email } = validatedData.data;
    //for normal user account
    let existed_userDoc;
    if (role === "admin") {
      existed_userDoc = await db
        .select()
        .from(users)
        .where(and(eq(users.user_name, username), eq(users.user_email, email)));
    } else {
      existed_userDoc = await db
        .select()
        .from(users)
        .where(eq(users.user_name, username));
    }

    if (existed_userDoc.length > 0) {
      return res.status(400).json({
        isSuccess: false,
        message: "The username you entered is already in use",
      });
    }
    //
    // Insert new user into the database
    // Hash the password before saving

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    if (role === "admin") {
      await db.insert(users).values({
        user_name: username,
        user_password: hashedPassword,
        role: role,
        user_email: email,
        created_at: new Date(),
        adminsToken: token,
      });
    } else {
      await db.insert(users).values({
        user_name: username,
        user_password: hashedPassword,
        role: role,
        user_email: null,
        created_at: new Date(),
      });
    }
    return res.status(201).json({
      isSuccess: true,
      message: "A new user has registered successfully",
    });
  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      message: "An error occurred during registration",
    });
  }
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

    const { username, password } = validatedData.data;

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.user_name, username));

    if (existingUser.length === 0) {
      return res.status(400).json({
        isSuccess: false,
        message: "Invalid Credentails",
      });
    }
    const userRole = existingUser[0].role;
    if (userRole !== "user") {
      return res.status(403).json({
        isSuccess: false,
        message: "Something went wrong",
      });
    }

    //protect multiple incorrect password
    const lockTimeLimit = 5 * 60 * 1000;
    const maxFailAttempt = 3;
    if (
      existingUser[0].failedLoginattempts >= maxFailAttempt &&
      new Date() - new Date(existingUser[0].last_failed_attempt) < lockTimeLimit
    ) {
      const remainingTime =
        lockTimeLimit -
        (new Date() - new Date(existingUser[0].last_failed_attempt));

      return res.status(400).json({
        lockTimeRemaining: remainingTime,
        isLocked: true,
        errorLockmessage: `Your account is temporarily locked. Please try again in ${Math.ceil(
          remainingTime / 60000
        )} minutes.`,
      });
    }
    const isMatch = await bcrypt.compare(
      password,
      existingUser[0].user_password
    );

    if (!isMatch) {
      await db
        .update(users)
        .set({
          failedLoginattempts: existingUser[0].failedLoginattempts + 1,
          last_failed_attempt: new Date(),
        })
        .where(eq(users.user_name, username));
      return res.status(400).json({
        isSuccess: false,
        message: "Invalid credentials",
      });
    }

    // Reset failed login attempts after successful login
    await db
      .update(users)
      .set({
        failedLoginattempts: 0,
        last_failed_attempt: null, // Optionally clear the last failed attempt timestamp
      })
      .where(eq(users.user_name, username));

    const JWT_token = jwt.sign(
      { userId: existingUser[0].user_id },
      process.env.JWT_KEY,
      { expiresIn: "7d" }
    );

    // Assign token for user in the database
    await db
      .update(users)
      .set({ user_token: JWT_token })
      .where(eq(users.user_name, username));

    const cookieOption = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
    };
    const { user_id, user_name, user_email, role, status, user_profileImage } =
      existingUser[0];

    const safeUser = {
      user_id,
      user_name,
      user_email,
      role,
      status,
      user_profileImage,
    };

    return res.status(200).cookie("token", JWT_token, cookieOption).json({
      isSuccess: true,
      message: "Successfully Logged In",
      token: JWT_token,
      loginUser: safeUser,
    });
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
    if (userDoc.length === 0) {
      return res.status(400).json({
        isSuccess: false,
        message: "Unauthorized user!!!",
      });
      // throw new Error("Unauthorized user!!!");
    }
    if (userDoc[0].status === "restricted") {
      return res.status(400).json({
        isSuccess: false,
        message: "Your account has been restricted",
      });
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

//edit profile
exports.editProfile = async (req, res) => {
  const { userID } = req;
  const { username, currentPassword, newPassword } = req.body;

  // Extract profile picture from uploaded files
  const profilePicture = req.files?.profilePicture
    ? req.files.profilePicture[0].path
    : req.body.profilePicture;

  let secureProfilePicUrl = "";

  try {
    // Fetch user from database
    const userDoc = await db
      .select()
      .from(users)
      .where(eq(users.user_id, userID));

    if (!userDoc || userDoc.length === 0) {
      return res
        .status(400)
        .json({ isSuccess: false, message: "User not found." });
    }

    // Handle password update if new password is provided
    if (currentPassword && newPassword) {
      // Await bcrypt comparison to ensure proper handling
      const isMatch = await bcrypt.compare(
        currentPassword,
        userDoc[0].user_password
      ); // Add await here
      if (!isMatch) {
        return res.status(400).json({
          isSuccess: false,
          message: "Current password is incorrect.",
        });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await db
        .update(users)
        .set({ user_password: hashedPassword })
        .where(eq(users.user_id, userID));
    }

    // Upload profile picture to Cloudinary if provided
    if (profilePicture) {
      await new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
          profilePicture,
          { folder: "user_profiles" },
          (err, result) => {
            if (err) {
              reject(new Error("Cloud upload failed for profile picture."));
            } else {
              secureProfilePicUrl = result.secure_url;
              resolve();
            }
          }
        );
      });
    }

    // Update user profile with new username and profile picture if provided
    await db
      .update(users)
      .set({
        user_name: username || userDoc[0].user_name,
        user_profileImage: secureProfilePicUrl || userDoc[0].user_profileImage,
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

exports.handleLogout = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        isSuccess: false,
        message: "No token found. Please login first.",
      });
    }

    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
        if (err) return reject(err);
        resolve(decoded);
      });
    });

    const userId = decoded.userId;
    const user = await db.select().from(users).where(eq(users.user_id, userId));

    if (user.length === 0) {
      return res.status(404).json({
        isSuccess: false,
        message: "User not found.",
      });
    }

    const updatePayload =
      user[0].role === "admin"
        ? { user_token: null, admins_token: null }
        : { user_token: null };

    await db.update(users).set(updatePayload).where(eq(users.user_id, userId));

    res
      .cookie("token", null, {
        httpOnly: true,
        expires: new Date(0),
      })
      .status(200)
      .json({
        isSuccess: true,
        message: "You have successfully logged out.",
      });
  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      message: "An error occurred while logging out.",
    });
  }
};

///login for admin and super admin
exports.adminsLoginHandler = async (req, res) => {
  try {
    // Validate the data using the provided schema
    const validatedData = AdminsSchema.safeParse(req.body);

    if (!validatedData.success) {
      return res.status(400).json({
        isSuccess: false,
        message: "Validation failed",
        errors: validatedData.error.errors,
      });
    }

    const { username, email, password, token } = validatedData.data;
    if (!email) {
      return res
        .status(400)
        .json({ message: "Admins must have an email address." });
    }

    if (!token) {
      return res
        .status(400)
        .json({ message: "Admins must have a valid token." });
    }
    const validTokens = [process.env.ADMIN_TOKEN, process.env.SUPERADMIN_TOKEN];
    if (!validTokens.includes(token)) {
      return res.status(400).json({ message: "Enter a valid token." });
    }
    // Fetch the user from the database
    const existingUser = await db
      .select()
      .from(users)
      .where(and(eq(users.user_email, email), eq(users.user_name, username)));

    if (existingUser.length === 0) {
      return res.status(400).json({
        isSuccess: false,
        message: "Invalid Credentials. Please try again",
      });
    }

    if (
      existingUser[0].role === "admin" &&
      existingUser[0].adminsToken !== process.env.ADMIN_TOKEN
    ) {
      return res.status(400).json({
        isSuccess: false,
        message: "Invalid Credentials",
      });
    }
    if (
      existingUser[0].role === "super" &&
      existingUser[0].adminsToken !== process.env.SUPERADMIN_TOKEN
    ) {
      return res.status(400).json({
        isSuccess: false,
        message: "Invalid Credentials",
      });
    }
    // Protect against multiple incorrect password attempts
    const lockTimeLimit = 5 * 60 * 1000;
    const maxFailAttempt = 3;
    if (
      existingUser[0].failedLoginattempts >= maxFailAttempt &&
      new Date() - new Date(existingUser[0].last_failed_attempt) < lockTimeLimit
    ) {
      const remainingTime =
        lockTimeLimit -
        (new Date() - new Date(existingUser[0].last_failed_attempt));

      return res.status(400).json({
        lockTimeRemaining: remainingTime,
        isLocked: true,
        errorLockmessage: `Your account is temporarily locked. Please try again in ${Math.ceil(
          remainingTime / 60000
        )} minutes.`,
      });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(
      password,
      existingUser[0].user_password
    );

    if (!isMatch) {
      // Increment failed login attempts
      await db
        .update(users)
        .set({
          failedLoginattempts: existingUser[0].failedLoginattempts + 1,
          last_failed_attempt: new Date(),
        })
        .where(and(eq(users.user_email, email), eq(users.user_name, username)));
      return res.status(400).json({
        isSuccess: false,
        message: "Invalid credentials",
      });
    }

    // Reset failed login attempts after successful login
    await db
      .update(users)
      .set({
        failedLoginattempts: 0,
        last_failed_attempt: null, // Optionally clear the last failed attempt timestamp
      })
      .where(and(eq(users.user_email, email), eq(users.user_name, username)));
    // Generate JWT token
    const JWT_token = jwt.sign(
      { userId: existingUser[0].user_id },
      process.env.JWT_KEY,
      { expiresIn: "7d" }
    );
    if (token === process.env.ADMIN_TOKEN) {
      await db
        .update(users)
        .set({ user_token: JWT_token })
        .where(and(eq(users.user_email, email), eq(users.user_name, username)));
    }
    if (token === process.env.SUPERADMIN_TOKEN) {
      await db
        .update(users)
        .set({ user_token: JWT_token })
        .where(and(eq(users.user_email, email), eq(users.user_name, username)));
    }
    // Assign the token to the user in the database

    // Set cookie options
    const cookieOption = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
    };

    const { user_id, user_name, user_email, role, status, user_profileImage } =
      existingUser[0];

    const safeUser = {
      user_id,
      user_name,
      user_email,
      role,
      status,
      user_profileImage,
    };
    return res.status(200).cookie("token", JWT_token, cookieOption).json({
      isSuccess: true,
      message: `Successfully Logged In`,
      token: JWT_token,
      loginUser: safeUser,
    });
  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      message: "An error occurred, please try again later.",
    });
  }
};
