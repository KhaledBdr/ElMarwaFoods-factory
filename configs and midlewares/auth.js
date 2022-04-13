const jwt = require("json-web-token");

module.exports.isAuth = (req, res, next) => {
  if (req.cookies.token) {
    const result = jwt.decode(process.env.jwtPrivateKey, req.cookies.token);
    if (result) {
      req.user = result.value;
      next();
    } else {
      res.redirect("/users/login");
    }
  } else {
    res.redirect("/users/login");
  }
};

module.exports.isNotAuth = (req, res, next) => {
  if (req.cookies.token) {
    const result = jwt.decode(
      process.env.jwtPrivateKey,
      req.cookies.token,
      (err, token) => {
        if (err) return next();
        if (token) {
          res.redirect("/customers");
        }
      }
    );
  } else {
    next();
  }
};

module.exports.isAdminORSuperAdmin = (req, res, next) => {
  if (req.cookies.token) {
    if (req.user.isAdmin || req.user.isSuperAdmin) {
      next();
    } else {
      res.redirect("/customers");
    }
  }
};

module.exports.canAddCust = (req, res, next) => {
  if (req.cookies.token) {
    if (req.user.addCust || req.user.isSuperAdmin || req.user.isAdmin) {
      next();
    } else {
      res.redirect("/customers");
    }
  }
};
