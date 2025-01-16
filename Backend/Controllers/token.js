const { eq } = require("drizzle-orm");
const { users, emailVerification } = require("../db");

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

module.exports = {
  create_verificationToken,
  Check_verification_token,
};
