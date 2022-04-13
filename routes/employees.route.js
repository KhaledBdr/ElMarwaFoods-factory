const { get } = require("jquery");
const {
  isAuth,
  isAdminORSuperAdmin,
} = require("../configs and midlewares/auth");
const {
  getEmployees,
  deleteEmployee,
  addCustPermission,
} = require("../controller/employeesController");

const router = require("express").Router();

router.get("/", isAuth, isAdminORSuperAdmin, getEmployees);
router.get("/delete/:id", isAuth, isAdminORSuperAdmin, deleteEmployee);
router.get(
  "/addCustPermission/:id",
  isAuth,
  isAdminORSuperAdmin,
  addCustPermission
);
module.exports.employeesRouter = router;
