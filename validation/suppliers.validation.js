const { body } = require("express-validator");

module.exports = {
  nameValidate: body("name")
    .isString()
    .withMessage("الاسم غير صالح")
    .notEmpty()
    .withMessage("من فضلك ادخل اسم المورد")
    .isLength({ min: 3, max: 50 })
    .withMessage("50 اسم المورد لابد وان يكون اكبر من 3 حروف و اقل من  حرف"),
  phoneValidate: body("phone")
    .notEmpty()
    .withMessage("من فضلك ادخل رقم الهاتف")
    .isNumeric()
    .withMessage("رقم غير صالح")
    .isLength({ min: 7, max: 12 })
    .withMessage("رقم غير صحيح"),
  itemValidate: body("item")
    .notEmpty()
    .withMessage("ادخل اسم المنتج")
    .isString()
    .withMessage("غير صالح"),
  amountValidate: body("amount")
    .notEmpty()
    .withMessage("ادخل الكميةالمنتج")
    .isNumeric()
    .withMessage("غير صالح"),
  priceValidate: body("price")
    .notEmpty()
    .withMessage("ادخل سعرالمنتج")
    .isNumeric()
    .withMessage("غير صالح"),
  paidValidate: body("paid")
    .isNumeric()
    .withMessage("ليس رقم")
    .notEmpty()
    .withMessage("اكتب المدفوع او 0")
    .custom((value) => {
      if (value >= 0) return true;
      else return false;
    })
    .withMessage("لا يمكن ان يكون اقل من 0"),
};
