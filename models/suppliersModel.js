const { connection } = require("../configs and midlewares/connection");

module.exports.getSuppliers = async () => {
  const query = `SELECT * FROM SUPPLIERS;`;
  return new Promise((resolve, reject) => {
    connection.query(query, (err, result) => {
      if (err) reject(err.message);
      resolve(result);
    });
  });
};

module.exports.addSupplier = async (newSup) => {
  const query = `INSERT INTO SUPPLIERS (name , phone , details) VALUES ('${newSup.name}' , ${newSup.phone} , '${newSup.details}');`;
  return new Promise((resolve, reject) => {
    connection.query(query, (err, result) => {
      if (err) reject(err.message);
      resolve(result);
    });
  });
};

module.exports.getSupplierByID = async (id) => {
  const query = `SELECT * FROM SUPPLIERS WHERE id = ${id};`;
  return new Promise((resolve, reject) => {
    connection.query(query, (err, result) => {
      if (err) reject(err.message);
      resolve(result);
    });
  });
};

module.exports.getSupplierBills = async (id) => {
  const query = `SELECT * FROM SUPPLIERSBILLS WHERE supId = ${id};`;
  return new Promise((resolve, reject) => {
    connection.query(query, (err, result) => {
      if (err) reject(err.message);
      resolve(result);
    });
  });
};

module.exports.getSupplierPayments = async (id) => {
  const query = `SELECT * FROM SUPPLIERSPAYMENTS WHERE supId = ${id};`;
  return new Promise((resolve, reject) => {
    connection.query(query, (err, result) => {
      if (err) reject(err.message);
      resolve(result);
    });
  });
};

module.exports.addSupplierBill = async (id, total, paid, bill) => {
  let date = Date.now();

  const query = `INSERT INTO suppliersbills (id , supId , cost , paid ) VALUES ('${date}',${id} , ${total} , ${paid});`;
  let restMoney = total - paid;
  const query3 = `UPDATE suppliers SET debt=debt+${restMoney} WHERE id=${id}`;
  /////////////////////////////
  const query4 = `INSERT INTO supplierspayments (supId , paid , debt) VALUES (${id} , ${paid} , ${
    total - paid
  })`;
  return new Promise(async (resolve, reject) => {
    connection.query(query, (err, result) => {
      if (err) reject(err.message);
    });
    await bill.forEach((b) => {
      let item = b.item;
      let amount = b.amount;
      let price = b.price;
      let total = b.price * b.amount;
      let query2 = `INSERT INTO supplierbilldetails (billId , item , amount , price , total) VALUES (${date} , '${item}' , ${amount} , ${price} , ${total} )`;
      connection.query(query2, (err2, result2) => {
        if (err2) reject(err2.message);
      });
    });
    connection.query(query3, (err3, result3) => {
      if (err3) reject(err3);
    });
    connection.query(query4, (err4, result4) => {
      if (err4) reject(err4);
      resolve(result4);
    });
  });
};

module.exports.getBillById = async (id) => {
  const query = `SELECT * FROM suppliersbills WHERE id=${id}`;
  return new Promise((resolve, reject) => {
    connection.query(query, (err, result) => {
      if (err) reject(err.message);
      resolve(result);
    });
  });
};

module.exports.getBillDetailsFromDB = async (billID) => {
  const query = `SELECT * FROM supplierbilldetails WHERE billId=${billID}`;
  return new Promise((resolve, reject) => {
    connection.query(query, (err, result) => {
      if (err) reject(err.message);
      resolve(result);
    });
  });
};
// module.exports.getPayments = async (payment) => {
//   const query = `INSERT INTO SUPPLIERS (name , phone , details) VALUES ('${newSup.name}' , ${newSup.phone} , '${newSup.details}');`;
//   return new Promise((resolve, reject) => {
//     connection.query(query, (err, result) => {
//       if (err) reject(err.message);
//       resolve(result);
//     });
//   });
// };
