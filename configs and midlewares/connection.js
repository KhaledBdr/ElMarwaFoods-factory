const mysql = require("mysql");
const database = "MarwaFoods";
var connection = mysql.createConnection({
  host: "localhost",
  password: "",
  user: "root",
  database: database,
});

connection.connect((err) => {
  if (err) throw err.message;
  console.log(`Connected to ${database}`);
});
module.exports.connection = connection;
