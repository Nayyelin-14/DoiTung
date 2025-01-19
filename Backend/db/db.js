//++++++++++++++++++++++++++++++++++++++++++
//Inport
//++++++++++++++++++++++++++++++++++++++++++
const { drizzle } = require("drizzle-orm/mysql2");
const connection = require("../connect/connect.js");
//++++++++++++++++++++++++++++++++++++++++++
const db = drizzle(connection);
//++++++++++++++++++++++++++++++++++++++++++
module.exports = db;
//++++++++++++++++++++++++++++++++++++++++++
