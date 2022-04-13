const {
  isAuth,
  isAdminORSuperAdmin,
  canAddCust,
} = require("../configs and midlewares/auth");
const {
  getAllCustomers,
  getHome,
  getCustomersRepresentations,
  getCustomersByRegion,
  getCustomersByName,
  getCustomerDetails,
  getBillDetails,
  deletePayment,
  getaddCustomer,
  postaddCustomer,
} = require("../controller/customersController");
const { notFoundPage } = require("../controller/notFoundPage");
const {
  getaddRepresentative,
  postAddUser,
} = require("../controller/usersController");
const {
  nameValidation,
  phoneValidation,
  passwordValidation,
  roleValidation,
  imageValidation,
} = require("../validation/addUser.validation");
const { upload } = require("../configs and midlewares/multer");
const {
  nameValid,
  phoneValid,
  addressValid,
  repValid,
  regionValid,
  gmailValid,
} = require("../validation/customer.validation");

const router = require("express").Router();

router.get("/", isAuth, getHome);
router.post("/", isAuth, getCustomersByName);
router.get("/all", isAuth, getAllCustomers);
router.get(
  "/representatives",
  isAuth,
  isAdminORSuperAdmin,
  getCustomersRepresentations
);
router.get("/region", isAuth, isAdminORSuperAdmin, getCustomersByRegion);
router.get("/CustomerDetails", isAuth, getCustomerDetails);
router.get("/billDetails", isAuth, getBillDetails);
router.get("/add-rep", isAuth, isAdminORSuperAdmin, getaddRepresentative);
router.post(
  "/add-rep",
  upload.single("image"),
  isAuth,
  isAdminORSuperAdmin,
  nameValidation,
  phoneValidation,
  passwordValidation,
  imageValidation,
  postAddUser
);
router.get("/add-cust", isAuth, canAddCust, getaddCustomer);
router.post(
  "/add-cust",
  isAuth,
  canAddCust,
  nameValid,
  phoneValid,
  addressValid,
  repValid,
  regionValid,
  gmailValid,
  postaddCustomer
);
router.get("/payments", isAuth, deletePayment);
router.get("/*", notFoundPage);
module.exports.customerRouter = router;
