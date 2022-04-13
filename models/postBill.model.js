const mysql = require("mysql");
const { connection } = require("../configs and midlewares/connection");

module.exports.postBill = async (id, bill) => {
  return new Promise((resolve, reject) => {
    let total = 0;
    for (let x = 0; x < bill.length; x++) {
      total += bill[x].price * bill[x].quantity;
    }
    const getBillsIdsquery = "SELECT billID FROM bills";
    let bigBillID = 0;
    let array = [];
    connection.query(getBillsIdsquery, async (err, result) => {
      if (err) reject(err.message);
      for (let n = 0; n < result.length; n++) {
        array.push(result[n].billID);
        bigBillID = Math.max(bigBillID, result[n].billID);
      }
      const newBID = bigBillID + 1;
      let Billquery;
      if (bill[bill.length - 1].notes) {
        Billquery = `INSERT INTO bills (customerID , BillID , totalCost,notes, rest) VALUE (${id} , ${newBID},${total} , ${
          bill[bill.length - 1].notes
        },${total});`;
      } else {
        Billquery = `INSERT INTO bills (customerID , BillID , totalCost , rest) VALUE (${id} , ${newBID},${total} , ${total});`;
      }
      connection.query(Billquery, (err, result) => {
        if (err) reject(err.message);
      });
      let queryBillDetails;
      bill.forEach((b) => {
        queryBillDetails = `INSERT INTO billsdetails (billID , item , count ,price ,total ) VALUE (${newBID} , '${
          b.item_Name
        }' , ${b.quantity} , ${b.price} , ${b.quantity * b.price});`;

        connection.query(queryBillDetails, (err, result) => {
          if (err) reject(err.message);
          const CustomerDebtquery = `SELECT debt FROM customers WHERE ID = ${id}`;

          connection.query(CustomerDebtquery, (err, oldDebt) => {
            const UpdateDebtquery = `UPDATE customers SET debt=${
              oldDebt[0].debt + total
            } WHERE ID = ${id}`;
            connection.query(UpdateDebtquery, (error, result) => {
              if (error) reject(error.message);
              resolve(newBID);
            });
          });
        });
      });
    });
  });
};

module.exports.getTotal = async (billID) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT totalCost FROM bills WHERE billID = ${billID}`;
    connection.query(query, (err, BillCost) => {
      if (err) reject(err.message);
      resolve(BillCost[0].totalCost);
    });
  });
};

module.exports.postPayment = async (billID, money) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM bills WHERE billID = ${billID}`;
    connection.query(query, (err, result) => {
      if (err) reject(err.message);
      const customerID = result[0].customerID;
      let payQuery = `UPDATE bills SET paid=${money} ,rest= ${
        result[0].totalCost - money
      } WHERE billID = ${billID};`;
      connection.query(payQuery, (err2, finalResult) => {
        if (err2) reject(err2.message);
        const getCustomerDebtquery = `SELECT debt FROM customers WHERE ID = ${customerID}`;
        connection.query(getCustomerDebtquery, (error, oldDebt) => {
          if (error) reject(error);
          const UpdateDebtquery = `UPDATE customers SET debt=${
            oldDebt[0].debt - money
          } WHERE ID = ${customerID}`;
          connection.query(UpdateDebtquery, (error2, result2) => {
            if (error2) reject(error2);
            const PaymentQUERY = ` INSERT INTO payments (customerID , billID , moneyPaid , remaining , notes) VALUE (${
              result[0].customerID
            }, ${billID} ,${money} , ${
              oldDebt[0].debt - money
            } , 'مدفوعات فاتورة رقم ${billID}');`;
            connection.query(PaymentQUERY, (errors, results) => {
              if (errors) reject(errors.message);
              resolve(results);
            });
          });
        });
      });
    });
  });
};

module.exports.deleteBill = async (billID) => {
  return new Promise((resolve, reject) => {
    const CustomerIDquery = `SELECT customerID , rest FROM bills WHERE billID = ${billID};`;
    const billDetails = `DELETE FROM billsdetails WHERE billID = ${billID};`;
    const Bill = `DELETE FROM bills WHERE billID = ${billID};`;
    const pay = `DELETE FROM payments WHERE billID = ${billID};`;
    connection.query(billDetails, (err, result) => {
      if (err) reject(err.message);
      connection.query(CustomerIDquery, (err2, result2) => {
        if (err2) reject(err2.message);
        connection.query(Bill, (err3, result3) => {
          if (err3) reject(err3.message);
          const getCustomerDebtquery = `SELECT debt FROM customers WHERE ID = ${result2[0].customerID}`;
          connection.query(getCustomerDebtquery, (error, oldDebt) => {
            if (error) reject(error);
            const UpdateDebtquery = `UPDATE customers SET debt=${
              oldDebt[0].debt - result2[0].rest
            } WHERE ID = ${result2[0].customerID}`;
            connection.query(UpdateDebtquery, (error2, result3) => {
              if (error2) reject(error2);
              connection.query(pay, (error3, result4) => {
                if (error3) reject(error3);
                resolve(result2[0].customerID);
              });
            });
          });
        });
      });
    });
  });
};
