const mysql = require("mysql");
const { connection } = require("../configs and midlewares/connection");

module.exports.getItems = () => {
  const query = `SELECT * FROM items `;
  return new Promise((resolve, reject) => {
    connection.query(query, (err, result) => {
      if (err) reject(err.message);
      resolve(result);
    });
  });
};

module.exports.getPrice = (item) => {
  const query = `SELECT sellPrice FROM items where item="${item}"`;
  return new Promise((resolve, reject) => {
    connection.query(query, (err, result) => {
      if (err) reject(err.message);
      resolve(result);
    });
  });
};
module.exports.getCustomerBills = async (id) => {
  const query = `SELECT * FROM Bills WHERE customerID = ${id}`;
  return new Promise((resolve, reject) => {
    connection.query(query, (err, result) => {
      if (err) reject(err.message);
      resolve(result);
    });
  });
};

module.exports.getBillDetails = async (id) => {
  const query = `SELECT * FROM billsdetails WHERE billID = ${id}`;
  return new Promise((resolve, reject) => {
    connection.query(query, (err, result) => {
      if (err) reject(err.message);
      resolve(result);
    });
  });
};

module.exports.getBillMoney = async (id) => {
  const query = `SELECT * FROM Bills WHERE billID = ${id}`;
  return new Promise((resolve, reject) => {
    connection.query(query, (err, result) => {
      if (err) reject(err.message);
      resolve(result);
    });
  });
};
