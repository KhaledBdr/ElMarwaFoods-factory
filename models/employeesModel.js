const { connection } = require("../configs and midlewares/connection");

module.exports.getEmployeesMODEL = async (id) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM users WHERE id!=${id}`;
    connection.query(query, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

module.exports.getImgesName = async () => {
  const query = `SELECT image FROM users`;
  return new Promise((resolve, reject) => {
    connection.query(query, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

module.exports.deleteEMPMODEL = async (id) => {
  const query = `DELETE FROM users WHERE id = ${id}`;
  return new Promise((resolve, reject) => {
    connection.query(query, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

module.exports.changePermission = async (id) => {
  return new Promise((resolve, reject) => {
    const getPermission = `SELECT addCust FROM users WHERE id = ${id}`;
    connection.query(getPermission, (error1, result1) => {
      if (error1) reject(error1.message);
      currentPermission = result1[0].addCust;
      const changePermission = `UPDATE users SET addCust=${!currentPermission} WHERE id=${id}`;
      connection.query(changePermission, (error2, result2) => {
        if (error2) reject(error2.message);
        resolve(result2);
      });
    });
  });
};
