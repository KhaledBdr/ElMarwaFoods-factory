const { body } = require("express-validator");

module.exports = {
  itemNameValid: body("item_Name")
    .isString()
    .withMessage("اختر الصنف المطلوب")
    .not()
    .isEmpty()
    .withMessage("اختر الصنف"),
  quantityValid: body("quantity")
    .isNumeric()
    .withMessage("ادخل كمية صحيحة")
    .not()
    .isEmpty()
    .withMessage("ادخل الكمية المرادة"),
  payValidation: body("payed")
    .isNumeric()
    .withMessage("ادخل المبلغ المدفوع")
    .not()
    .isEmpty()
    .withMessage("ادخل المبلغ المدفوع"),
};
