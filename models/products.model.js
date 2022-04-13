const { connection } = require("../configs and midlewares/connection");

module.exports.getProducts = async () => {
  return new Promise((resolve, reject) => {
    const Query = `SELECT * FROM items`;
    connection.query(Query, (error, result) => {
      if (error) reject(error.message);
      resolve(result);
    });
  });
};

module.exports.getProductById = async (id) => {
  return new Promise((resolve, reject) => {
    const QueryID = `SELECT * FROM items WHERE id=${id}`;
    connection.query(QueryID, (error, result) => {
      if (error) reject(error.message);
      resolve(result);
    });
  });
};

module.exports.addProduct = async (data) => {
  return new Promise((resolve, reject) => {
    const QueryInsert = `INSERT INTO items (item , sellPrice , quantity , weight) VALUE ('${data.item}', ${data.sellPrice} , ${data.quantity} , ${data.weight});`;
    connection.query(QueryInsert, (error, result) => {
      if (error) reject(error.message);
      resolve(result);
    });
  });
};

module.exports.editProduct = async (id, data) => {
  return new Promise((resolve, reject) => {
    const QueryUpdate = `UPDATE items  SET item='${data.item}' , sellPrice=${data.sellPrice} , quantity=${data.quantity} , weight=${data.weight} WHERE id=${id} ;`;
    connection.query(QueryUpdate, (error, result) => {
      if (error) reject(error.message);
      resolve(result);
    });
  });
};

module.exports.deleteOrderFromOurProducts = async (list) => {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < list.length; i++) {
      let element = list[i];
      let query = `UPDATE items SET quantity=quantity-${element.quantity} WHERE item='${element.item_Name}' && sellPrice=${element.price};`;
      connection.query(query, (err, result) => {
        if (err) reject(err.message);
        resolve(result);
      });
    }
  });
};

module.exports.addBillToOurProducts = async (bill) => {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < bill.length; i++) {
      let element = bill[i];
      // billID: 3,
      // item: 'جزر',
      // count: 5,
      // price: 70,
      // total: 350

      let query = `UPDATE items SET quantity=quantity+${element.count} WHERE item='${element.item}' && sellPrice=${element.price};`;
      connection.query(query, (err, result) => {
        if (err) reject(err.message);
        resolve(result);
      });
    }
  });
};
