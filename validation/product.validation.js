const { body } = require("express-validator");

module.exports = {
  itemValidation: body("item")
    .isString()
    .notEmpty()
    .withMessage("ادخل اسم المنتج")
    .isLength({ min: 2 })
    .withMessage("لا يمكن ان يكون اسم المنتج اقل من حرفين"),
  weightValidation: body("weight")
    .notEmpty()
    .withMessage("من فضلك ادخل الوزن")
    .isNumeric()
    .withMessage("ادخل رقم صحيح")
    .custom((value) => {
      if (value <= 0) return false;
      return true;
    })
    .withMessage("ادخل رقم صحيح"),
  sellPriceValidation: body("sellPrice")
    .notEmpty()
    .withMessage("من فضلك ادخل السعر")
    .isNumeric()
    .withMessage("ادخل سعر صحيح")
    .custom((value) => {
      if (value <= 0) return false;
      return true;
    })
    .withMessage("ادخل سعر صحيح"),

  quantityValidation: body("quantity")
    .notEmpty()
    .withMessage("من فضلك ادخل لكمية الموجودة")
    .isNumeric()
    .withMessage("ادخل كمية صحيح"),
};
