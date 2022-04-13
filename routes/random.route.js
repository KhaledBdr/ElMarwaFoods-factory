const { isAuth } = require("../configs and midlewares/auth");
const { getHome } = require("../controller/customersController");
const { notFoundPage } = require("../controller/notFoundPage");

const router = require("express").Router();
router.get("/", isAuth, getHome);
router.get("/*", notFoundPage);
module.exports.randomRoute = router;
