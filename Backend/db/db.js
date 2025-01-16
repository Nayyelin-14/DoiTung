//++++++++++++++++++++++++++++++++++++++++++
//Inport
//++++++++++++++++++++++++++++++++++++++++++
const { drizzle } = require("drizzle-orm/mysql2");
const connection = require("../connect/connect");
//++++++++++++++++++++++++++++++++++++++++++
const db = drizzle(connection);
//++++++++++++++++++++++++++++++++++++++++++
module.exports = db;
//++++++++++++++++++++++++++++++++++++++++++
