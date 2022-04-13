const { validationResult } = require("express-validator");
const { connection } = require("../configs and midlewares/connection");
const {
  getCustomerBills,
  getBillDetails,
  getBillMoney,
} = require("../models/billsModel");
const {
  getAllCustomers,
  getRepresenativeCustomers,
  getRegionCustomers,
  getCustomersByName,
  getCustomersById,
  findCustomer,
  addCustomer,
} = require("../models/customerModel");
const { getPayments, deletePayment } = require("../models/paymentsModel");
const { getRep, getRegions } = require("../models/user.Model");
const {
  getFormattedDate,
} = require("./../configs and midlewares/getFormattedDate");

module.exports.getHome = async (req, res) => {
  let rep = await getRep();
  if (
    req.user.isRepresentative &&
    !req.user.isAdmin &&
    !req.user.isSuperAdmin
  ) {
    rep = [req.user.name];
  }

  let regions = await getRegions();

  console.log(rep);
  res.render("home", {
    title: "Home Page",
    customer: false,
    searchKey: false,
    user: req.user,
    rep: rep,
    regions: regions,
    active: "customers",
  });
};

module.exports.getAllCustomers = async (req, res) => {
  const all = req.user.isAdmin || req.user.isSuperAdmin;
  const Customers = await getAllCustomers(all, req.user.name);
  let rep = await getRep();
  if (
    req.user.isRepresentative &&
    !req.user.isAdmin &&
    !req.user.isSuperAdmin
  ) {
    rep = [req.user.name];
  }
  const regions = await getRegions();
  res.render("home", {
    title: "Home Page",
    customer: Customers,
    searchKey: false,
    user: req.user,
    rep: rep,
    regions: regions,
    active: "customers",
  });
};

module.exports.getCustomersRepresentations = async (req, res) => {
  const Customers = await getRepresenativeCustomers(req.query.represenative);
  let rep = await getRep();
  if (
    req.user.isRepresentative &&
    !req.user.isAdmin &&
    !req.user.isSuperAdmin
  ) {
    rep = [req.user.name];
  }
  const regions = await getRegions();
  res.render("home", {
    title: "Home Page",
    customer: Customers,
    searchKey: false,
    user: req.user,
    rep: rep,
    regions: regions,
    active: "customers",
  });
};

module.exports.getCustomersByRegion = async (req, res) => {
  const rep = await getRep();
  const regions = await getRegions();
  const Customers = await getRegionCustomers(req.query.region);
  res.render("home", {
    title: "Home Page",
    customer: Customers,
    searchKey: false,
    user: req.user,
    rep: rep,
    regions: regions,
    active: "customers",
  });
};

module.exports.getCustomersByName = async (req, res) => {
  const rep = await getRep();
  const regions = await getRegions();
  const all = req.user.isAdmin || req.user.isSuperAdmin;
  const Customers = await getCustomersByName(
    req.body.customerName,
    all,
    req.user.name
  );
  res.render("home", {
    title: "Home Page",
    customer: Customers,
    searchKey: req.body.customerName,
    user: req.user,
    rep: rep,
    regions: regions,
    active: "customers",
  });
};

module.exports.getCustomerDetails = async (req, res) => {
  const Customer = await getCustomersById(req.query.ID);
  const bills = await getCustomerBills(req.query.ID);
  const payments = await getPayments(req.query.ID);
  await bills.forEach((bill) => {
    bill.date = getFormattedDate(bill.date);
  });

  await payments.forEach((pay) => {
    pay.date = getFormattedDate(pay.date);
  });
  res.render("customerPage", {
    title: Customer[0].name,
    customer: Customer[0],
    bills: bills,
    payments: payments,
    user: req.user,
    active: "customers",
  });
};

module.exports.getBillDetails = async (req, res) => {
  const billID = req.query.billID;
  const bills = await getBillDetails(billID);
  const billMoney = await getBillMoney(billID);
  let totalCost = 0;
  let totalNum = 0;
  bills.forEach((bill) => {
    totalCost += bill.total;
    totalNum += bill.count;
  });
  res.render("billPage", {
    title: `Bill#-${billID}`,
    billID: billID,
    bills: bills,
    totalCost: totalCost,
    BillPayed: billMoney[0].paid,
    BillRest: billMoney[0].rest,
    totalNum: totalNum,
    user: req.user,
    customerID: req.query.customerID,
    i: 1,
    active: "customers",
  });
};

module.exports.deletePayment = async (req, res) => {
  await deletePayment(
    req.query.payID,
    req.query.customerID,
    parseInt(req.query.Paid)
  );
  res.redirect(`/customers/CustomerDetails?ID=${req.query.customerID}`);
};

module.exports.getaddCustomer = async (req, res) => {
  const regions = await getRegions();
  let reps = await getRep();
  if (
    req.user.isRepresentative &&
    !req.user.isAdmin &&
    !req.user.isSuperAdmin
  ) {
    reps = [{ name: req.user.name }];
  }
  res.render("addCustomer", {
    title: "اضافة عميل",
    user: req.user,
    errors: [],
    reps: reps,
    regions: regions,
    info: false,
    active: "add-cust",
  });
};

module.exports.postaddCustomer = async (req, res) => {
  const regions = await getRegions();
  let reps = await getRep();
  if (
    req.user.isRepresentative &&
    !req.user.isAdmin &&
    !req.user.isSuperAdmin
  ) {
    reps = [req.user.name];
  }
  const { errors } = validationResult(req);
  if (errors.length != 0) {
    return res.render("addCustomer", {
      title: "اضافة عميل",
      user: req.user,
      errors: errors,
      reps: reps,
      regions: regions,
      info: req.body,
      active: "add-cust",
    });
  } else {
    const customer = req.body;
    const DBCustomer = await findCustomer(customer.name);
    if (DBCustomer.length != 0) {
      return res.render("addCustomer", {
        title: "اضافة عميل",
        user: req.user,
        errors: [
          {
            param: "name",
            msg: "العميل موجود بالفعل",
          },
        ],
        reps: reps,
        regions: regions,
        info: req.body,
        active: "add-cust",
      });
    } else {
      const result = await addCustomer(customer);
      console.log(result);
      return res.redirect("/customers");
    }
  }
};
