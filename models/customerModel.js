const mysql = require("mysql");
const { connection } = require("../configs and midlewares/connection");

module.exports.getAllCustomers = async (status, name) => {
  let query = `SELECT * FROM customers WHERE rep= '${name}';`;
  if (status) {
    query = `SELECT * FROM customers`;
  }
  return new Promise((resolve, reject) => {
    connection.query(query, (err, result) => {
      if (err) reject(err.message);
      resolve(result);
    });
  });
};

module.exports.getRepresenativeCustomers = async (repre) => {
  const query = `SELECT * FROM customers WHERE rep='${repre}';`;
  return new Promise((resolve, reject) => {
    connection.query(query, (err, result) => {
      if (err) reject(err.message);
      resolve(result);
    });
  });
};

module.exports.getRegionCustomers = async (region) => {
  const query = `SELECT * FROM customers WHERE region='${region}';`;
  return new Promise((resolve, reject) => {
    connection.query(query, (err, result) => {
      if (err) reject(err.message);
      resolve(result);
    });
  });
};

module.exports.getCustomersByName = async (name, status, rep) => {
  let query = `SELECT * FROM customers WHERE rep='${rep}' AND name LIKE '%${name}%' OR name LIKE '${name}%' OR name='${name}';`;
  if (status) {
    query = `SELECT * FROM customers WHERE name LIKE '%${name}%' OR name LIKE '${name}%' OR name='${name}';`;
  }
  return new Promise((resolve, reject) => {
    connection.query(query, (err, result) => {
      if (err) reject(err.message);
      resolve(result);
    });
  });
};

module.exports.findCustomer = async (name) => {
  let query = `SELECT * FROM customers WHERE name = '${name}';`;

  return new Promise((resolve, reject) => {
    connection.query(query, (err, result) => {
      if (err) reject(err.message);
      resolve(result);
    });
  });
};

module.exports.getCustomersById = async (id) => {
  const query = `SELECT * FROM customers WHERE ID='${id}';`;
  return new Promise((resolve, reject) => {
    connection.query(query, (err, result) => {
      if (err) reject(err.message);
      resolve(result);
    });
  });
};

module.exports.getCustomerDebt = async (id) => {
  const query = `SELECT debt FROM customers WHERE ID='${id}';`;
  return new Promise((resolve, reject) => {
    connection.query(query, (err, result) => {
      if (err) reject(err.message);
      resolve(result[0].debt);
    });
  });
};

module.exports.addCustomer = async (info) => {
  return new Promise((resolve, reject) => {
    const getRepID = `SELECT id FROM users WHERE name='${info.rep}'`;

    connection.query(getRepID, (err, result) => {
      if (err) reject(err);
      const repID = result[0].id;
      const query = `INSERT INTO customers (name,phone,address,gmail,rep,repID,region) Value ('${info.name}' , ${info.phone} , '${info.address}','${info.gmail}','${info.rep}' , ${repID} , '${info.region}')`;
      connection.query(query, (err2, result2) => {
        if (err2) reject(err2);
        resolve(result2);
      });
    });
  });
};
