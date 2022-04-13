const bcrypt = require("bcrypt");
const { connection } = require("../app");

module.exports.logUser = async (user) => {
  const query1 = `SELECT * FROM Users WHERE phone='${user.phone}';`;
  return new Promise((resolve, reject) => {
    connection.query(query1, async (err, result) => {
      if (err) reject(err.message);
      if (result.length != 0) {
        const passwordResult = await bcrypt.compare(
          user.password,
          result[0].password
        );
        if (!passwordResult) {
          resolve("incorrect password");
        } else {
          resolve(result[0]);
        }
      } else {
        resolve(404);
      }
    });
  });
};

module.exports.addUser = async (user) => {
  return new Promise((resolve, reject) => {
    const findPhoneQuery = `SELECT * FROM users WHERE phone=${user.phone};`;
    const findNameQuery = `SELECT * FROM users WHERE name='${user.name}';`;
    const addQuery = `INSERT INTO users (name , phone , password , isAdmin , isRepresentative , image) VALUE ('${user.name}' , ${user.phone} , '${user.password}' , ${user.isAdmin} , ${user.isRepresentative} , '${user.image}')`;
    connection.query(findPhoneQuery, (err, result) => {
      if (err) reject(err.message);
      if (result.length != 0) {
        resolve("phone");
      } else {
        connection.query(findNameQuery, (err2, result2) => {
          if (err2) reject(err2.message);
          if (result2.length != 0) {
            resolve("name");
          } else {
            connection.query(addQuery, (err3, result3) => {
              if (err3) reject(err3.message);
              resolve(result3);
            });
          }
        });
      }
    });
  });
};

module.exports.getRep = async () => {
  return new Promise((resolve, reject) => {
    const query = `SELECT name FROM users WHERE isRepresentative = true`;
    connection.query(query, (err, result) => {
      if (err) reject(err.msg);
      resolve(result);
    });
  });
};

module.exports.getRegions = async () => {
  return new Promise((resolve, reject) => {
    const query = `SELECT DISTINCT region FROM regions`;
    connection.query(query, (err, result) => {
      if (err) reject(err.msg);
      resolve(result);
    });
  });
};

module.exports.postEditProfile = async (user, id, rep) => {
  return new Promise((resolve, reject) => {
    console.log(user.name);
    const checkNameQuery = `SELECT * FROM users WHERE name='${user.name}' AND id != ${id}`;
    const query = `UPDATE users SET name='${user.name}',image='${user.image}' WHERE id = ${id};`;
    const changeInCustomerPage = `UPDATE customers SET rep = '${user.name}' WHERE repID = ${id}`;
    connection.query(checkNameQuery, (error, results) => {
      if (error) reject(error.message);
      console.log(results);
      if (results.length == 0) {
        connection.query(query, (err, result) => {
          if (err) reject(err.message);
          console.log(`results.isRepresentative : ${results}`);
          if (rep) {
            connection.query(changeInCustomerPage, (err2, res) => {
              if (err2) reject(err2);
              resolve(res);
            });
          } else {
            resolve(result);
          }
        });
      } else {
        resolve("404");
      }
    });
  });
};

module.exports.checkPassword = async (id) => {
  return new Promise((resolve, reject) => {
    const q1 = `SELECT password FROM users WHERE id=${id}`;
    connection.query(q1, (err, result) => {
      if (err) reject(err.message);
      resolve(result[0].password);
    });
  });
};

module.exports.changePassword = async (id, newPassword) => {
  return new Promise((resolve, reject) => {
    const q1 = `UPDATE users SET password='${newPassword}'  WHERE id=${id}`;
    connection.query(q1, (err, result) => {
      if (err) reject(err.message);
      resolve(result);
    });
  });
};
