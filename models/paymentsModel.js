const { connection } = require("../configs and midlewares/connection");

module.exports.singlePayment = async (customerID, payed, remaining, notes) => {
  return new Promise((resolve, reject) => {
    let query = `INSERT INTO payments (customerID , moneyPaid , remaining) 
                    VALUE (${customerID} ,${payed} , ${remaining})`;
    if (notes.length != 0) {
      query = `INSERT INTO payments (customerID , moneyPaid , remaining , notes) 
                    VALUE (${customerID} ,${payed} , ${remaining} , '${notes}')`;
    }
    connection.query(query, (err, result) => {
      if (err) reject(err.message);
      const deletePaymentFromList = `UPDATE customers SET debt=${remaining} WHERE ID = ${customerID}`;
      connection.query(deletePaymentFromList, (error, result2) => {
        if (error) reject(error.message);
        resolve(result2);
      });
    });
  });
};

module.exports.getPayments = async (custID) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM payments WHERE customerID = ${custID};`;
    connection.query(query, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

module.exports.deletePayment = async (payID, CustID, Paid) => {
  return new Promise((resolve, reject) => {
    let query1 = `SELECT billID FROM payments WHERE payID = ${payID}`;
    let query2 = `DELETE FROM payments WHERE payID = ${payID}`;
    let query3 = `SELECT debt FROM customers WHERE ID = ${CustID}`;
    connection.query(query1, (err3, result3) => {
      if (err3) reject(err3);
      if (result3[0].billID != null) {
        const getPaymentFromBill = `SELECT totalCost FROM bills WHERE billID = ${result3[0].billID}`;
        connection.query(getPaymentFromBill, (er, totalCost) => {
          if (er) reject(er.message);
          const deletePaymentFromBill = `UPDATE bills set paid = 0,rest = ${totalCost[0].totalCost}  WHERE billID = ${result3[0].billID};`;
          connection.query(deletePaymentFromBill, (er2, deleted) => {
            if (er2) reject(er2.message);
          });
        });
      }
      connection.query(query2, (err1, result1) => {
        if (err1) reject(err1);
        connection.query(query3, (err2, oldDebt) => {
          if (err2) reject(err2);
          let lastQuery = `UPDATE  customers SET debt= ${
            oldDebt[0].debt + parseInt(Paid)
          } WHERE ID = ${CustID}`;
          connection.query(lastQuery, (err3, lastResult) => {
            if (err3) reject(err3);
            resolve(lastResult);
          });
        });
      });
    });
  });
};
