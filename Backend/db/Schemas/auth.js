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
  user_password: varchar("user_password", { length: 225 }).notNull(),
  user_token: varchar("user_token", { length: 250 }),
  role: text("role").default("user").notNull(),
  status: text("status").default("active"),
  user_profileImage: text("user_profileImage"),
  failedLoginattempts: int("failed_attempts").default(0),
  last_failed_attempt: timestamp("last_failed_attempt", {
    mode: "date",
  }),
  created_at: timestamp("created_at", {
    mode: "date",
  })
    .notNull()
    .defaultNow(),
});

module.exports = {
  users,
};
