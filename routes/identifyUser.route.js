const router = require("express").Router();
const { isNotAuth, isAuth } = require("../configs and midlewares/auth");
const { upload } = require("../configs and midlewares/multer");
// import  controllers
const {
  getLoginPage,
  postLogin,
  logOut,
} = require("../controller/identifyUser.controller");
const { notFoundPage } = require("../controller/notFoundPage");
const {
  getUserProfile,
  getEditProfile,
  postEditProfile,
  getChangePassword,
  postChangePassword,
} = require("../controller/usersController");
const {
  nameValidation,
  phoneValidation,
  passwordValidation,
  imageValidation,
  newPasswordValidation,
  confirmNewPasswordValidation,
} = require("../validation/addUser.validation");

// set controllers
router.get("/login", isNotAuth, getLoginPage);
router.post("/login", isNotAuth, postLogin);
router.get("/logout", isAuth, logOut);
router.get("/profile", isAuth, getUserProfile);
router.get("/profile/edit", isAuth, getEditProfile);
router.post(
  "/profile/edit",
  upload.single("image"),
  isAuth,
  nameValidation,
  imageValidation,
  passwordValidation,
  postEditProfile
);
router.get("/changePassword", isAuth, getChangePassword);
router.post(
  "/changePassword",
  isAuth,
  passwordValidation,
  newPasswordValidation,
  confirmNewPasswordValidation,
  postChangePassword
);
router.get("/*", notFoundPage);

module.exports.identificationRouter = router;
