const express = require("express");
const layout = require("express-ejs-layouts");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const PORT = process.env.PORT || 3000;
const app = express();

app.set("view engine", "ejs");
app.use(layout);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static("images"));
app.use(express.static("node_modules"));
app.use(cookieParser());

//
const delete_unusedImage = require("./configs and midlewares/delete_unusedImage");
delete_unusedImage();
// connection
const mysql = require("mysql");
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "MarwaFoods",
});
connection.connect();
module.exports.connection = connection;
// import routes
const { identificationRouter } = require("./routes/identifyUser.route");
const { customerRouter } = require("./routes/customer.route");
const { billRouter } = require("./routes/bills.route");
const { randomRoute } = require("./routes/random.route");
const { employeesRouter } = require("./routes/employees.route");
const { suppliersRouter } = require("./routes/suppliers.route");
const {
  unlinkUncompressedFiles,
} = require("./configs and midlewares/fileEditor");
const deleteIMG = require("./configs and midlewares/delete_unusedImage");
const { productRouter } = require("./routes/products.router");
// set routes
app.use("/users", identificationRouter);
app.use("/customers", customerRouter);
app.use("/bills", billRouter);
app.use("/employees", employeesRouter);
app.use("/products", productRouter);
app.use("/suppliers", suppliersRouter);
app.use("/", randomRoute);
app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
