const { body, custom } = require("express-validator");

module.exports = {
  nameValid: body("name")
    .notEmpty()
    .withMessage("ادخل اسم العميل")
    .isLength({ min: 3 })
    .withMessage("يجب الا يقل اسم العميل عن 3 حروف"),
  repValid: body("rep").notEmpty().withMessage("ادخل اسم المندوب"),
  regionValid: body("region").notEmpty().withMessage("ادخل القطاع"),
  phoneValid: body("phone")
    .notEmpty()
    .withMessage("ادخل الهاتف الخاص بالعميل")
    .isLength({ min: 9 })
    .withMessage("رقم هاتف غير صحيح"),
  gmailValid: body("gmail").isEmail().withMessage("الايميل غير صحيح"),
  addressValid: body("address").notEmpty().withMessage("ادخل عنوان العميل"),
};
