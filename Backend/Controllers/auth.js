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
  const { role } = req.body;

  // Determine which schema to use
  const schema = role === "admin" ? AdminsSchema : RegisterSchema;

  // Ensure required fields are present for admin
  if (role === "admin") {
    if (!req.body.token || !req.body.email) {
      return res.status(400).json({
        isSuccess: false,
        message: "Invalid credentials",
      });
    }
  }

  try {
    // Validate incoming data
    const validatedData = schema.safeParse(req.body);
    if (!validatedData.success) {
      return res.status(400).json({
        isSuccess: false,
        message: "Validation failed",
        errors: validatedData.error.errors,
      });
    }

    const { username, password, token, email } = validatedData.data;

    // Check if the user already exists
    let existingUserQuery;
    if (role === "admin") {
      existingUserQuery = await db
        .select()
        .from(users)
        .where(and(eq(users.user_name, username), eq(users.user_email, email)));
    } else {
      existingUserQuery = await db
        .select()
        .from(users)
        .where(eq(users.user_name, username));
    }

    if (existingUserQuery.length > 0) {
      return res.status(400).json({
        isSuccess: false,
        message: "The username you entered is already in use",
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user into database
    const newUserData = {
      user_name: username,
      user_password: hashedPassword,
      role: role,
      user_email: role === "admin" ? email : null,
      created_at: new Date(),
      ...(role === "admin" && { adminsToken: token }),
    };

    await db.insert(users).values(newUserData);

    return res.status(201).json({
      isSuccess: true,
      message: "A new user has registered successfully",
    });
  } catch (error) {
    console.error("Registration error:", error); // Added for debugging
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
        message: "Invalid credentials",
      });
    }
    if (existingUser[0].status !== "active") {
      return res.status(403).json({
        isSuccess: false,
        message: "Your account has been restricted.Contact admin team.",
      });
    }
    const userRole = existingUser[0].role;
    if (userRole !== "user") {
      return res.status(403).json({
        isSuccess: false,
        message: "Unauthorized login attempt",
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

      return res.status(429).json({
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
  console.log("fgregers", userID);
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
    console.log(userDoc[0])
    console.log(userDoc[0].status)
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

    await db
      .update(users)
      .set({ user_token: null })
      .where(eq(users.user_id, userId));

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

exports.adminsLoginHandler = async (req, res) => {
  try {
    // Validate input
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
      return res.status(400).json({
        isSuccess: false,
        message: "Admins must have an email address.",
      });
    }

    if (!token) {
      return res.status(400).json({
        isSuccess: false,
        message: "Admins must have a valid token.",
      });
    }

    // Fetch user from DB
    const userQuery = await db
      .select()
      .from(users)
      .where(and(eq(users.user_email, email), eq(users.user_name, username)));

    if (userQuery.length === 0) {
      return res.status(400).json({
        isSuccess: false,
        message: "Invalid credentials. Please try again.",
      });
    }

    const user = userQuery[0];

    // Check token based on role
    const validAdminToken = user.role === "admin" && token === user.adminsToken;
    const validSuperadminToken =
      user.role === "superadmin" && token === process.env.SUPERADMIN_TOKEN;

    if (!validAdminToken && !validSuperadminToken) {
      return res.status(400).json({
        isSuccess: false,
        message: "Invalid token",
      });
    }

    // Check if account is locked
    const lockTimeLimit = 5 * 60 * 1000; // 5 minutes
    const maxFailAttempt = 3;
    const now = new Date();

    if (
      user.failedLoginattempts >= maxFailAttempt &&
      now - new Date(user.last_failed_attempt) < lockTimeLimit
    ) {
      const remainingTime =
        lockTimeLimit - (now - new Date(user.last_failed_attempt));
      return res.status(400).json({
        isSuccess: false,
        isLocked: true,
        lockTimeRemaining: remainingTime,
        errorLockmessage: `Your account is temporarily locked. Please try again in ${Math.ceil(
          remainingTime / 60000
        )} minutes.`,
      });
    }

    // Verify password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.user_password
    );
    if (!isPasswordCorrect) {
      // Increment failed attempts
      await db
        .update(users)
        .set({
          failedLoginattempts: user.failedLoginattempts + 1,
          last_failed_attempt: now,
        })
        .where(and(eq(users.user_email, email), eq(users.user_name, username)));

      return res.status(400).json({
        isSuccess: false,
        message: "Invalid credentials",
      });
    }

    // Successful login: Reset failed attempts
    await db
      .update(users)
      .set({
        failedLoginattempts: 0,
        last_failed_attempt: null,
      })
      .where(and(eq(users.user_email, email), eq(users.user_name, username)));

    // Generate JWT
    const jwtToken = jwt.sign({ userId: user.user_id }, process.env.JWT_KEY, {
      expiresIn: "7d",
    });

    // Save token to DB
    if (validAdminToken || validSuperadminToken) {
      await db
        .update(users)
        .set({ user_token: jwtToken })
        .where(and(eq(users.user_email, email), eq(users.user_name, username)));
    }

    // Cookie settings
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: "strict",
    };

    // Return safe user info
    const { user_id, user_name, user_email, role, status, user_profileImage } =
      user;
    const safeUser = {
      user_id,
      user_name,
      user_email,
      role,
      status,
      user_profileImage,
    };

    return res.status(200).cookie("token", jwtToken, cookieOptions).json({
      isSuccess: true,
      message: "Successfully Logged In",
      token: jwtToken,
      loginUser: safeUser,
    });
  } catch (error) {
    console.error("Login error:", error); // Keep minimal error log
    return res.status(500).json({
      isSuccess: false,
      message: "An error occurred, please try again later.",
    });
  }
};
