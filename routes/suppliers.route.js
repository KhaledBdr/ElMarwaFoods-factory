const { Router } = require("express");
const {
  isAuth,
  isAdminORSuperAdmin,
} = require("../configs and midlewares/auth");
const {
  getSupPage,
  postSupPage,
  supPage,
  getAddBill,
  getAddPayment,
  addAnotherItemToTheBill,
  postTheBill,
  finishTheBill,
  getBillDETAILS,
} = require("../controller/suppliersController");
const {
  nameValidate,
  phoneValidate,
  itemValidate,
  priceValidate,
  amountValidate,
  paidValidate,
} = require("../validation/suppliers.validation");
const router = Router();

router.get("/", isAuth, isAdminORSuperAdmin, getSupPage);
router.get("/add-sup", isAuth, isAdminORSuperAdmin, getSupPage);
router.post(
  "/add-sup",
  isAuth,
  isAdminORSuperAdmin,
  nameValidate,
  phoneValidate,
  postSupPage
);

router.get("/sup/:id", isAuth, isAdminORSuperAdmin, supPage);

router.get("/add-bill/:id", isAuth, isAdminORSuperAdmin, getAddBill);

router.post(
  "/bill/addAnotherItemToTheBill/:id",
  isAuth,
  isAdminORSuperAdmin,
  itemValidate,
  priceValidate,
  amountValidate,
  addAnotherItemToTheBill
);
router.post(
  "/add-bill/:id",
  isAuth,
  isAdminORSuperAdmin,
  itemValidate,
  priceValidate,
  amountValidate,
  postTheBill
);
router.post(
  "/finishTheBill/:id",
  isAuth,
  isAdminORSuperAdmin,
  paidValidate,
  finishTheBill
);
router.get("add-payment/:id", isAuth, isAdminORSuperAdmin, getAddPayment);
router.get("/billDetails", isAuth, isAdminORSuperAdmin, getBillDETAILS);
module.exports.suppliersRouter = router;
