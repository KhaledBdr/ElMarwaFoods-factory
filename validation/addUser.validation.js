const { body } = require("express-validator");
module.exports = {
  roleValidation: body("role")
    .not()
    .isEmpty()
    .withMessage("اختر نوع الوظيفة")
    .custom((value) => {
      if (value != "isRepresentative" || value != "isAdmin") {
        return false;
      }
      return true;
    })
    .withMessage("نوع الوظيفة غير صحيح"),
  passwordValidation: body("password")
    .notEmpty()
    .withMessage("من فضلك ادخل كلمة السر")
    .isLength({ min: 8 })
    .withMessage("كلمة السر لايمكن ان تكون اقل من 8 احرف"),
  nameValidation: body("name")
    .notEmpty()
    .withMessage("من فضلك ادخل الاسم")
    .isLength({ min: 5 })
    .withMessage("الاسم لا يمكن ان يكون اقل من 5 احرف"),
  phoneValidation: body("phone")
    .isNumeric()
    .withMessage("ادخل رقم الهاتف")
    .isLength({ min: 10 })
    .withMessage("ادخل رقم هاتف صحيح"),
  imageValidation: body("image").custom((value, { req }) => {
    if (req.file == undefined) {
      return true;
    } else if (req.file.mimetype.split("/")[0] !== "image") {
      throw new Error("ليست صورة من فضلك اختر صورة صالحة");
    } else {
      return true;
    }
  }),
  newPasswordValidation: body("newPassword")
    .notEmpty()
    .withMessage(`من فضلك ادخل كلمة السر الجديدة`)
    .isLength({ min: 8 })
    .withMessage("لا يمكن ان تكون اقل من 8 حروف")
    .custom((value, { req }) => {
      if (value == req.body.password) {
        throw new Error(" كلمة السر الجديدة تطابق القديمة");
      }
      return true;
    }),
  confirmNewPasswordValidation: body("confirmPassword")
    .notEmpty()
    .withMessage(`اعد كتابة كلمة السر الجديدة`)
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("لا تطابق كلمة السر الجديدة");
      }
      return true;
    }),
};
