'use strict';

const sqlite = require('sqlite3');
const db = new sqlite.Database('ezwhDB.db', (err) => {
  if (err) throw err;
});

  exports.storeUser = (data) => {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO USER(USERNAME, NAME, SURNAME, PASSWORD, TYPE) VALUES(?, ?, ?, ?, ?)';
      db.run(sql, [data.username, data.name, data.surname, data.password, data.type], (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }

  exports.isThereUser = (data) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT COUNT(*) AS N FROM USER WHERE USERNAME = ? AND TYPE = ?';
      db.all(sql, [data.username, data.type], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        else if (rows===undefined){
          resolve(false);
        } else {
          resolve(rows[0].N);
        }
      });
    });
  }

  exports.existUser = (data) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT COUNT(*) AS N FROM USER WHERE USERNAME = ? AND PASSWORD = ? AND TYPE = ?';
      db.all(sql, [data.username, data.password, data.type], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        else if (rows===undefined){
          resolve(false);
        }
        else{
          resolve(rows[0].N);
        }
      });
    });
  }

  exports.getUser = (data) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM USER WHERE USERNAME = ? AND TYPE = ?';
      db.all(sql, [data.username, data.type], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        else if (rows===undefined){
          resolve(false);
        }
        else{
          const user = rows.map((r) => (
            {
              id: r.ID,
              name: r.NAME,
              surname: r.SURNAME,
              username: r.USERNAME,
              type: r.TYPE
            }
          ));
          resolve(user[0]);
        }
      });
    });
  }

  exports.getStoredSuppliers = () => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM USER WHERE TYPE = "supplier" ';
      db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        else if (rows===undefined){
          resolve(false);
        }
        else {
          const users = rows.map((r) => (
            {
              id: r.ID,
              name: r.NAME,
              surname: r.SURNAME,
              email: r.USERNAME
            }
          ));
          resolve(users);
        }
      });
    });
  }

  exports.getStoredUsers = () => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM USER WHERE TYPE != "manager" ';
      db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        else if (rows===undefined){
          resolve(false);
        }
        else {
          const users = rows.map((r) => (
            {
              id: r.ID,
              name: r.NAME,
              surname: r.SURNAME,
              email: r.USERNAME,
              type: r.TYPE
            }
          ));
        resolve(users);
        }
      });
    });
  }

  exports.modifyRightsStoredUser = (data) => {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE USER SET TYPE = ? WHERE USERNAME = ? AND TYPE = ?';
      db.run(sql, [data.newType, data.username, data.oldType], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        else if (rows===undefined){
          resolve(false);
        }
        else {
         resolve();
        }
      });
    });
  }

  exports.deleteStoredUser = (data) => {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM USER WHERE USERNAME = ? AND TYPE = ?';
      db.run(sql, [data.username, data.type], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
         else if (rows===undefined){
          resolve(false);
        }
        else {
         resolve();
        }
      });
    });
  }

  exports.deleteAllUsers = () => {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM USER WHERE TYPE != "manager"';
      db.run(sql, [], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
         else if (rows===undefined){
          resolve(false);
        }
        else {
         resolve();
        }
      });
    });
  }

  exports.resetUserAutoincrement = () => {
    return new Promise((resolve, reject) => {
      const sql = "DELETE FROM SQLITE_SEQUENCE WHERE NAME='USER'";
      db.run(sql, [], (err, rows) => {
        if (err) {
          reject(err); return;
        }
        resolve();
      });
    });
  }