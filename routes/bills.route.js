const { isAuth } = require("../configs and midlewares/auth");
const {
  getAddBill,
  anothotherItem,
  addAnothotherItem,
  postBill,
  postPay,
  deleteBill,
  getAddPaymentPage,
  postPaymentPage,
} = require("../controller/billController");
const {
  itemNameValid,
  quantityValid,
  payValidation,
} = require("../validation/requestItem.validation");
const router = require("express").Router();

router.get("/add-bill", isAuth, getAddBill);
router.post(
  "/add-bill/:id",
  isAuth,
  itemNameValid,
  quantityValid,
  addAnothotherItem
);
router.post("/add-bill/done/:id", isAuth, postBill);

router.post("/pay/:billID", isAuth, payValidation, postPay);
router.get("/deleteBill", isAuth, deleteBill);
router.get("/add-payment", isAuth, getAddPaymentPage);
router.post("/add-payment/:customerID", isAuth, payValidation, postPaymentPage);
module.exports.billRouter = router;
