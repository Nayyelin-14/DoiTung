// db/schema/users.js

const { createId } = require("@paralleldrive/cuid2");
const { relations } = require("drizzle-orm");
const { primaryKey, int, boolean } = require("drizzle-orm/mysql-core");
const {
  mysqlTable,
  varchar,
  text,
  timestamp,
} = require("drizzle-orm/mysql-core");

const users = mysqlTable("users", {
  user_id: varchar("user_id", { length: 225 })
    .primaryKey()
    .$defaultFn(() => createId()),
  user_name: varchar("user_name", { length: 225 }).notNull(),
  user_email: varchar("user_email", { length: 225 }).notNull(),
  user_password: varchar("user_password", { length: 365 }), // 'text' should work for bcrypt hash
  user_token: varchar("user_token", { length: 250 }),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
  }).default(null),
  isTwostepEnabled: boolean("isTwostepEnabled").default(false),
  role: text("role").default("user"),
  user_profileImage: text("user_profileImage"),
  created_at: timestamp("created_at", {
    mode: "date",
  }).notNull(),
});

const accounts = mysqlTable(
  "account",
  {
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.user_id, { onDelete: "cascade" }),
    user_email: varchar("user_email", { length: 225 }).notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: varchar("refresh_token", { length: 255 }),
    access_token: varchar("access_token", { length: 255 }),
    expires_at: int("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: varchar("id_token", { length: 2048 }),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);
const emailVerification = mysqlTable(
  "emailverification",
  {
    verification_id: varchar("verification_id", { length: 225 }).$defaultFn(
      () => createId()
    ),
    verification_token: varchar("verification_token", {
      length: 500,
    }).notNull(),
    expires: timestamp("expires", {
      mode: "date",
    }).notNull(),
    user_email: varchar("user_email", { length: 225 }).notNull(),
    user_id: varchar("user_id", { length: 225 }).references(
      () => users.user_id,
      {
        onDelete: "cascade",
      }
    ),
  },
  (table) => ({
    compoundKey: primaryKey({
      columns: [table.verification_id, table.verification_token],
    }),
  })
);

const Two_step = mysqlTable(
  "twofactor",
  {
    Twostep_ID: varchar("Twostep_ID", { length: 225 }).$defaultFn(() =>
      createId()
    ),
    Twostep_code: varchar("Twostep_code", {
      length: 500,
    }).notNull(),
    expires: timestamp("expires", {
      mode: "date",
    }).notNull(),
    user_email: varchar("user_email", { length: 225 }).unique().notNull(),
    user_id: varchar("user_id", { length: 225 }).references(
      () => users.user_id,
      {
        onDelete: "cascade",
      }
    ),
  },
  (table) => ({
    compoundKey: primaryKey({
      columns: [table.Twostep_ID, table.Twostep_code],
    }),
  })
);

module.exports = {
  users,
  emailVerification,
  Two_step,
  accounts,
};
