require("dotenv").config();
exports.getBaseUrl = () => {
  if (typeof window !== "undefined") return "";
  //   if (process.env.VERCEL_URL) return `http://${process.env.VERCEL_URL}`;
  return `${process.env.UI_PORT}`;
};
