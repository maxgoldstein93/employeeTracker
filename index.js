require("dotenv").config();
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: process.env.DB_PASS,
  database: "playlist_DB"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
 
});