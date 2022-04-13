const {
  isAdminORSuperAdmin,
  isAuth,
} = require("../configs and midlewares/auth");
const {
  getAllProducts,
  getaddProducts,
  geteditProducts,
  postaddProducts,
  posteditProducts,
} = require("../controller/productController");
const {
  itemValidation,
  quantityValidation,
  weightValidation,
  sellPriceValidation,
} = require("../validation/product.validation");

const router = require("express").Router();
router.get("/", isAuth, isAdminORSuperAdmin, getAllProducts);
router.get("/add-product", isAuth, isAdminORSuperAdmin, getaddProducts);
router.get("/edit-product/:id", isAuth, isAdminORSuperAdmin, geteditProducts);

router.post(
  "/add-product",
  isAuth,
  isAdminORSuperAdmin,
  itemValidation,
  quantityValidation,
  weightValidation,
  sellPriceValidation,
  postaddProducts
);
router.post(
  "/edit-product/:id",
  isAuth,
  isAdminORSuperAdmin,
  itemValidation,
  quantityValidation,
  weightValidation,
  sellPriceValidation,
  posteditProducts
);
module.exports.productRouter = router;
