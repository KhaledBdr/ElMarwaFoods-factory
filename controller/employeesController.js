const {
  getFormattedDate,
} = require("../configs and midlewares/getFormattedDate");
const {
  getEmployeesMODEL,
  deleteEMPMODEL,
  changePermission,
} = require("../models/employeesModel");

const deleteImage = require("./../configs and midlewares/delete_unusedImage");
module.exports.getEmployees = async (req, res) => {
  // getEmployees
  let employees = await getEmployeesMODEL(req.user.id);
  await employees.forEach((emp) => {
    emp.joinDate = getFormattedDate(emp.joinDate);
  });
  res.render("employees", {
    title: "الموظفين",
    user: req.user,
    employees: employees,
    active: "employees",
  });
};

module.exports.deleteEmployee = async (req, res) => {
  const deleted = await deleteEMPMODEL(req.params.id);
  deleteImage();
  res.redirect("/employees");
};

module.exports.addCustPermission = async (req, res) => {
  const id = req.params.id;
  await changePermission(id);
  res.redirect("/employees");
};
