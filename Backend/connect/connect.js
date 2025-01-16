const mysql = require("mysql2");
//++++++++++++++++++++++++++++++++++++++++++
// DB Connection
//++++++++++++++++++++++++++++++++++++++++++
require("dotenv").config();

const connection = mysql.createConnection(process.env.DATABASE_URL);
//++++++++++++++++++++++++++++++++++++++++++
// DB Connection Test
//++++++++++++++++++++++++++++++++++++++++++
connection.connect((err) => {
  if (err) {
    console.log("There Is Error In DB Connection:" + err);
  } else {
    console.log("DB Connected Succefully");
  }
});
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports = connection;
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
