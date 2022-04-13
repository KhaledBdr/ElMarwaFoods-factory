const jwt = require("json-web-token");
const {
  getFormattedDate,
} = require("../configs and midlewares/getFormattedDate");
const { logUser } = require("../models/user.Model");

module.exports.getLoginPage = (req, res) => {
  res.render("login", {
    title: "Login Page",
    errors: [],
    user: false,
    active: "",
  });
};

module.exports.postLogin = async (req, res) => {
  const userData = {
    phone: req.body.phone,
    password: req.body.password,
  };
  let user = await logUser(userData);
  if (user != 404 && user != "incorrect password") {
    user.joinDate = getFormattedDate(user.joinDate);
    const token = jwt.encode(process.env.jwtPrivateKey, user);
    res.cookie("token", token.value, {
      maxAge: 2999999999999999999999999999,
      httpOnly: true,
      overwrite: true,
    });

    res.redirect("/customers");
  } else {
    let errors = [];
    if (user == 404) {
      errors.push({
        param: "not",
        msg: "user not found",
      });
    } else {
      errors.push({
        param: "password",
        msg: "incorrect password",
      });
    }

    res.render("login", {
      title: "Login Page",
      errors: errors,
      user: req.body,
      active: "",
    });
  }
};

module.exports.logOut = async (req, res) => {
  res.clearCookie("token");
  res.redirect("/users/login");
};
