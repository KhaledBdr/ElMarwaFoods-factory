const { validationResult } = require("express-validator");
const {
  addUser,
  postEditProfile,
  logUser,
  checkPassword,
  changePassword,
} = require("../models/user.Model");
const delete_unusedImage = require("./../configs and midlewares/delete_unusedImage");
const bcrypt = require("bcrypt");
const { sharpImage } = require("../configs and midlewares/sharpConfig");
const {
  unlinkUncompressedFiles,
} = require("../configs and midlewares/fileEditor");
const deleteImage = require("../configs and midlewares/delete_unusedImage");
const {
  getFormattedDate,
} = require("../configs and midlewares/getFormattedDate");
const jwt = require("json-web-token");

module.exports.getaddRepresentative = (req, res) => {
  const user = req.user;
  res.render("AddRep", {
    title: "اضافة مندوب",
    user: user,
    info: false,
    errors: [],
    active: "add-rep",
  });
};

module.exports.postAddUser = async (req, res) => {
  const { errors } = validationResult(req);
  if (errors.length != 0) {
    return res.render("AddRep", {
      title: "اضافة مندوب",
      user: req.user,
      info: req.body,
      errors: errors,
      active: "add-rep",
    });
  } else {
    bcrypt.hash(req.body.password, 10, async function (err, hash) {
      let image = "default.png";
      if (req.file) {
        await sharpImage(req.file.path);
        unlinkUncompressedFiles();
        image = req.file.path.split("\\")[1].split(".")[0] + ".png";
      }
      let user = {
        image: image,
        name: req.body.name,
        password: hash,
        phone: req.body.phone,
      };
      if (req.body.role == "isAdmin") {
        user.isAdmin = true;
        user.isRepresentative = false;
      } else {
        user.isAdmin = false;
        user.isRepresentative = true;
      }
      const newUser = await addUser(user);
      console.log(newUser);
      if (newUser == "phone") {
        return res.render("AddRep", {
          title: "اضافة مندوب",
          user: req.user,
          info: req.body,
          errors: [
            {
              param: "phone",
              msg: "هذا الرقم مستخدم بالفعل",
            },
          ],
          active: "add-rep",
        });
      } else if (newUser == "name") {
        return res.render("AddRep", {
          title: "اضافة مندوب",
          user: req.user,
          info: req.body,
          errors: [
            {
              param: "name",
              msg: "هذا الموظف مسجل بالفعل",
            },
          ],
          active: "add-rep",
        });
      } else {
        res.redirect("/employees");
      }

      deleteImage();
    });
  }
};

module.exports.getUserProfile = async (req, res) => {
  res.render("profile", {
    title: req.user.name,
    user: req.user,
    active: "profile",
  });
};

module.exports.getEditProfile = (req, res) => {
  res.render("editProfile", {
    title: `${req.user.name} تعديل`,
    user: req.user,
    errors: [],
    newInfo: req.user,
    active: "profile",
  });
};

module.exports.postEditProfile = async (req, res) => {
  const { errors } = validationResult(req);
  if (errors.length != 0) {
    return res.render("editProfile", {
      title: `${req.user.name} تعديل`,
      user: req.user,
      newInfo: req.body,
      errors: errors,
      active: "profile",
    });
  } else {
    if (req.body.name == req.user.name && !req.file) {
      return res.render("editProfile", {
        title: `${req.user.name} تعديل`,
        user: req.user,
        newInfo: req.body,
        errors: [
          {
            param: "same",
            msg: "لم يتم تغيير اى بيانات",
          },
        ],
        active: "profile",
      });
    } else {
      let image = req.user.image;
      if (req.file) {
        await sharpImage(req.file.path);
        unlinkUncompressedFiles();
        image = req.file.path.split("\\")[1].split(".")[0] + ".png";
      }
      const userData = {
        phone: req.user.phone,
        password: req.body.password,
      };
      let user = await logUser(userData);
      if (user != 404 && user != "incorrect password") {
        const newInfo = {
          name: req.body.name,
          image: image,
        };
        const result = await postEditProfile(
          newInfo,
          req.user.id,
          req.user.isRepresentative
        );
        // console.log(result);
        if (result != "404") {
          unlinkUncompressedFiles();
          delete_unusedImage();
          return res.redirect("/users/logout");
        } else {
          return res.render("editProfile", {
            title: `${req.user.name} تعديل`,
            user: req.user,
            newInfo: req.body,
            errors: [
              {
                param: "name",
                msg: "الاسم موجود بالفعل",
              },
            ],
            active: "profile",
          });
        }
      } else {
        return res.render("editProfile", {
          title: `${req.user.name} تعديل`,
          user: req.user,
          newInfo: req.body,
          errors: [
            {
              param: "password",
              msg: "كلمة السر خاطئة",
            },
          ],
          active: "profile",
        });
      }
    }
  }
};

module.exports.getChangePassword = (req, res) => {
  res.render("changePassword", {
    title: "تغيير كلمة المرور",
    user: req.user,
    errors: [],
    active: "profile",
  });
};

module.exports.postChangePassword = async (req, res) => {
  const { errors } = validationResult(req);
  if (errors.length != 0) {
    return res.render("changePassword", {
      title: "تغيير كلمة المرور",
      user: req.user,
      errors: errors,
      active: "profile",
    });
  }
  // no errors
  //check password
  const password = req.body.password;
  const newPassword = req.body.newPassword;
  const hashedPassword = await checkPassword(req.user.id);
  bcrypt.compare(password, hashedPassword, async (err, result) => {
    if (err) throw err.message;
    if (!result) {
      return res.render("changePassword", {
        title: "تغيير كلمة المرور",
        user: req.user,
        errors: [
          {
            param: "password",
            msg: "كلمة السر غير صحيحة",
          },
        ],
        active: "profile",
      });
    } else {
      bcrypt.hash(newPassword, 10, async function (err, hash) {
        if (err) throw err.message;
        await changePassword(req.user.id, hash);
        res.redirect("/users/logout");
      });
    }
  });
};
