const { validationResult } = require("express-validator");
const {
  addSupplier,
  getSuppliers,
  getSupplierByID,
  getSupplierBills,
  getSupplierPayments,
  addSupplierBill,
  getBillById,
  getBillDetailsFromDB,
} = require("../models/suppliersModel");
const {
  getFormattedDate,
} = require("./../configs and midlewares/getFormattedDate");

module.exports.getSupPage = async (req, res) => {
  const suppliers = await getSuppliers();
  res.render("suppliers", {
    title: "المورديين",
    active: "sup",
    user: req.user,
    errors: [],
    values: false,
    suppliers: suppliers,
  });
};
module.exports.postSupPage = async (req, res) => {
  const suppliers = await getSuppliers();
  const { errors } = validationResult(req);
  if (errors.length != 0) {
    return res.render("suppliers", {
      title: "المورديين",
      active: "sup",
      user: req.user,
      errors: errors,
      values: req.body,
      suppliers: suppliers,
    });
  }
  let details = "لا يوجد اى معلومات اضافية";
  if (req.body.details.length > 1) {
    details = req.body.details;
  }
  const newSup = {
    name: req.body.name,
    phone: req.body.phone,
    details: details,
  };
  console.log(newSup);
  const adding = await addSupplier(newSup);
  console.log(adding);
  res.redirect("/suppliers");
};

module.exports.supPage = async (req, res) => {
  const supID = req.params.id;
  const supplier = await getSupplierByID(supID);
  const bills = await getSupplierBills(supID);
  const payments = await getSupplierPayments(supID);
  await bills.forEach((bill) => {
    bill.date = getFormattedDate(bill.date);
  });

  await payments.forEach((pay) => {
    pay.date = getFormattedDate(pay.date);
  });
  console.log(supplier);
  res.render("supplierPage", {
    title: supplier[0].name,
    supplier: supplier[0],
    bills: bills,
    payments: payments,
    user: req.user,
    active: "sup",
  });
};

let items = [];
module.exports.getAddBill = async (req, res) => {
  items = [];
  const supId = req.params.id;
  res.render("add-bill(suppliers)", {
    title: "اضافة فاتورة",
    active: "sup",
    user: req.user,
    errors: [],
    items: [],
    supId: supId,
  });
};
module.exports.addAnotherItemToTheBill = async (req, res) => {
  const supId = req.params.id;
  const { errors } = validationResult(req);
  if (errors.length != 0) {
    return res.render("add-bill(suppliers)", {
      title: "اضافة فاتورة",
      active: "sup",
      user: req.user,
      errors: errors,
      items: items,
      supId: supId,
    });
  } else {
    let totalPrice = req.body.amount * req.body.price;
    const newItem = {
      item: req.body.item,
      amount: req.body.amount,
      price: req.body.price,
      totalPrice: totalPrice,
    };
    items.push(newItem);

    req.body = [];
    res.render("add-bill(suppliers)", {
      title: "اضافة فاتورة",
      active: "sup",
      user: req.user,
      errors: [],
      items: items,
      supId: supId,
    });
  }
};

module.exports.postTheBill = async (req, res) => {
  const supId = req.params.id;
  const { errors } = validationResult(req);
  if (errors.length != 0) {
    return res.render("add-bill(suppliers)", {
      title: "اضافة فاتورة",
      active: "sup",
      user: req.user,
      errors: errors,
      items: items,
      supId: supId,
    });
  } else {
    let totalPrice = req.body.amount * req.body.price;
    const newItem = {
      item: req.body.item,
      amount: req.body.amount,
      price: req.body.price,
      totalPrice: totalPrice,
    };
    items.push(newItem);
    // id, total, paid, bill
    ////////////////
    let billPrice = 0;
    items.forEach((i) => {
      billPrice += i.totalPrice;
    });
    return res.render(`supplierPay`, {
      title: "عملية الدفع",
      active: "sup",
      errors: [],
      debt: billPrice,
      supId: supId,
      user: req.user,
    });
  }
};

module.exports.finishTheBill = async (req, res) => {
  const { errors } = validationResult(req);
  const supId = req.params.id;
  let billPrice = 0;
  items.forEach((i) => {
    billPrice += i.totalPrice;
  });
  if (errors.length != 0) {
    return res.render(`supplierPay`, {
      title: "عملية الدفع",
      active: "sup",
      errors: errors,
      debt: billPrice,
      supId: supId,
      user: req.user,
    });
  }
  const paid = req.body.paid;
  await addSupplierBill(supId, billPrice, paid, items);
  res.redirect(`/suppliers`);
};
module.exports.getAddPayment = async (req, res) => {
  const supId = req.params.id;
  res.render("supplierPay", {
    active: "pay",
    title: "عملية الدفع",
    supId: supId,
    debt: 0,
    user: req.user,
  });
};

module.exports.getBillDETAILS = async (req, res) => {
  const idList = req.query; // { supplierID: '', billID: '' }
  const billID = idList.billID;
  const billDetails = await getBillDetailsFromDB(billID);
  const billMoney = await getBillById(idList.billID);
  let totalCost = 0;
  let totalNum = 0;
  billDetails.forEach((bill) => {
    totalCost += bill.total;
    totalNum += bill.amount;
  });
  res.render("billPage", {
    title: `Bill#-${billID}`,
    billID: billID,
    bills: billDetails,
    totalCost: totalCost,
    BillPayed: billMoney[0].paid,
    BillRest: billMoney[0].cost - billMoney[0].paid,
    totalNum: totalNum,
    user: req.user,
    customerID: idList.supplierID,
    i: 1,
    active: "sup",
  });
  /*
    const billMoney = await getBillMoney(billID);


  */
};
