const mysql = require("mysql2");
const util = require("util");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "A1B2C3Z10",
  database: "employee_db",
});

connection.query = util.promisify(connection.query);

connection.connect(function (err) {
  if (err) {
    throw err;
  }
});

module.exports = connection;