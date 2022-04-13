const { validationResult } = require("express-validator");
const { getItems, getPrice, getBillDetails } = require("../models/billsModel");
const { getCustomerDebt } = require("../models/customerModel");
const { singlePayment } = require("../models/paymentsModel");
const {
  postBill,
  getTotal,
  postPayment,
  deleteBill,
} = require("../models/postBill.model");
const {
  deleteOrderFromOurProducts,
  addBillToOurProducts,
} = require("../models/products.model");

module.exports.getAddBill = async (req, res) => {
  list = [];
  or = [];
  console.log(req.body);
  req.body = [];
  const items = await getItems();
  res.render("addBill", {
    custID: req.query.customerID,
    title: "add Bill",
    items: items,
    orders: "",
    errors: false,
    user: req.user,
    active: "customers",
  });
};

let or = [];
let list = [];
module.exports.addAnothotherItem = async (req, res) => {
  const items = await getItems();
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    or.push(req.body);
    list = await getprice(or);
    res.render("addBill", {
      title: "add Bill",
      items: items,
      orders: list,
      i: 1,
      errors: false,
      custID: req.params.id,
      user: req.user,
      active: "customers",
    });
  } else {
    let list = await getprice(or);
    res.render("addBill", {
      title: "add Bill",
      items: items,
      orders: list,
      i: 1,
      errors: errors.array(),
      custID: req.params.id,
      user: req.user,
      active: "customers",
    });
  }
};

async function getprice(orders) {
  if (orders) {
    var newList = [];
    for (let index = 0; index < orders.length; index++) {
      const element = orders[index];
      element.quantity = parseInt(element.quantity);
      const price = await getPrice(element.item_Name);
      element.price = parseInt(price[0].sellPrice);
      newList.push(element);
    }
    return newList;
  } else {
    return orders;
  }
}

module.exports.postBill = async (req, res) => {
  const items = await getItems();

  if (list.length == 0 && req.body.quantity == "" && !req.body.item_Name) {
    console.log("list.length == 0");
    const errors = [
      {
        param: "item",
        msg: "لا يوجد مبيعات",
      },
    ];
    res.render("addBill", {
      title: "add Bill",
      items: items,
      orders: "",
      i: 1,
      errors: errors,
      custID: req.params.id,
      user: req.user,
      active: "customerscustomers",
    });
  } else {
    if (req.body.quantity && !req.body.item_Name) {
      console.log("req.body.quantity && !req.body.item_Name");
      const errors = [
        {
          param: "item_Name",
          msg: "اختر الصنف ",
        },
      ];
      res.render("addBill", {
        title: "add Bill",
        items: items,
        orders: "",
        i: 1,
        errors: errors,
        custID: req.params.id,
        user: req.user,
        active: "customers",
      });
    } else if (req.body.quantity == "" && req.body.item_Name) {
      console.log('req.body.quantity == "" && req.body.item_Name');
      const errors = [
        {
          param: "quantity",
          msg: "حدد الكمية المطلوبة ",
        },
      ];
      res.render("addBill", {
        title: "add Bill",
        items: items,
        orders: "",
        i: 1,
        errors: errors,
        custID: req.params.id,
        user: req.user,
        active: "customers",
      });
    } else {
      if (req.body.quantity && req.body.item_Name) {
        console.log("req.body.quantity && req.body.item_Name");
        or.push(req.body);
        list = await getprice(or);
      }

      if (!list[list.length - 1].notes) {
        list[list.length - 1].notes = false;
      }
      const billID = await postBill(req.params.id, list);
      const deleteOrderFromOurProduct = await deleteOrderFromOurProducts(list);
      console.log(list);
      res.render("payPage", {
        title: "Payment Page",
        billID: billID,
        totalCost: await getTotal(billID),
        errors: [],
        user: req.user,
        active: "customers",
      });
    }
  }
};

module.exports.postPay = async (req, res) => {
  const { errors } = validationResult(req);
  if (errors.length != 0) {
    res.render("payPage", {
      title: "Payment Page",
      billID: req.params.billID,
      totalCost: await getTotal(req.params.billID),
      errors: errors,
      user: req.user,
      active: "customers",
    });
  } else {
    const result = await postPayment(req.params.billID, req.body.payed);
    res.redirect(`/customers/billDetails?billID=${req.params.billID}`);
  }
};

module.exports.getAddPaymentPage = async (req, res) => {
  const debt = await getCustomerDebt(req.query.customerID);
  res.render("payDebt", {
    title: `Payment Page - ${req.query.customerID}`,
    customerID: req.query.customerID,
    debt: debt,
    errors: [],
    user: req.user,
    active: "customers",
  });
};

module.exports.postPaymentPage = async (req, res) => {
  const { errors } = validationResult(req);
  if (errors.length != 0) {
    res.render("payDebt", {
      title: `Payment Page - ${req.params.customerID}`,
      customerID: req.params.customerID,
      debt: req.body.debt,
      errors: errors,
      user: req.user,
      active: "customers",
    });
  } else {
    const notes = req.body.notes;
    const payed = req.body.payed;
    const customerID = req.params.customerID;
    const remaining = req.body.debt - req.body.payed;
    await singlePayment(customerID, payed, remaining, notes);
    res.redirect(`/customers/CustomerDetails?ID=${customerID}`);
  }
};
module.exports.deleteBill = async (req, res) => {
  const billID = req.query.billID;
  const billDetails = await getBillDetails(billID);
  const addBillToOurProduct = await addBillToOurProducts(billDetails);
  const customerID = await deleteBill(billID);

  res.redirect(`/customers/CustomerDetails?ID=${customerID}`);
};
