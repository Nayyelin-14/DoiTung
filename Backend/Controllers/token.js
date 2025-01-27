const { eq } = require("drizzle-orm");
const { users, emailVerification, Two_step } = require("../db");

const crypto = require("crypto");

const db = require("../db/db");
const Check_verification_token = async (email, token) => {
  console.log(email, token);

  let verification_token;
  try {
    if (email) {
      verification_token = await db
        .select()
        .from(emailVerification)
        .where(eq(emailVerification.user_email, email));
    }
    if (token) {
      verification_token = await db
        .select()
        .from(emailVerification)
        .where(eq(emailVerification.verification_token, token));
    }

    console.log("hello", verification_token);
    return verification_token;
  } catch (error) {
    return error;
  }
};

const create_verificationToken = async (email) => {
  try {
    const token = crypto.randomUUID();
    const expires_time = new Date(new Date().getTime() + 30 * 60 * 1000);
    if (!email) {
      throw new Error("404 error. Something went wrong!!!");
    }

    // Check if the user exists in the database
    const existed_user = await db
      .select()
      .from(users)
      .where(eq(users.user_email, email));

    if (existed_user.length === 0) {
      throw new Error("User not found");
    }

    const existedToken = await Check_verification_token(
      existed_user[0].user_email,
      null
    );

    if (existedToken && existedToken.length > 0) {
      await db
        .delete(emailVerification)
        .where(
          eq(emailVerification.verification_id, existedToken[0].verification_id)
        );
    }

    await db.insert(emailVerification).values({
      verification_token: token,
      expires: expires_time,
      user_email: existed_user[0].user_email,
      user_id: existed_user[0].user_id,
    });

    const get_Token = await db
      .select()
      .from(emailVerification)
      .where(eq(emailVerification.user_email, email));
    console.log(get_Token);
    return get_Token;
  } catch (error) {
    return error;
  }
};

const getTwoStepCodeByEmail = async (email) => {
  try {
    const existingCode = await db
      .select()
      .from(Two_step)
      .where(eq(Two_step.user_email, email));
    return existingCode;
  } catch (error) {
    return null;
  }
};
const generateTwoStepCode = async (email, userID) => {
  try {
    // Fetch user by email to get their ID
    const user = await db
      .select()
      .from(users)
      .where(eq(users.user_email, email));

    if (user.length === 0) {
      throw new Error("User not found");
    }

    const twostepCode = crypto.randomInt(100000, 1000000).toString();
    const codeExpire = new Date(new Date().getTime() + 30 * 60 * 1000);

    const existingCode = await getTwoStepCodeByEmail(email);
    if (existingCode.length > 0) {
      await db
        .delete(Two_step)
        .where(eq(Two_step.Twostep_ID, existingCode[0].Twostep_ID)); // Ensure correct syntax and `id` comparison
    }

    await db.insert(Two_step).values({
      Twostep_code: twostepCode,
      expires: codeExpire,
      user_email: email,
      user_id: userID,
    });

    return twostepCode;
  } catch (error) {
    return null;
  }
};
module.exports = {
  generateTwoStepCode,
  create_verificationToken,
  Check_verification_token,
};
