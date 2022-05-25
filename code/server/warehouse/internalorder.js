'use strict';
const dayjs = require('dayjs');

const sqlite = require('sqlite3');
const db = new sqlite.Database('ezwhDB.db', (err) => {
  if (err) throw err;
});


exports.getInternalOrders = async function () {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM INTERNALORDER';
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const orders = rows.map((r) => (
        {
          id: r.ID,
          issueDate: r.ISSUEDATE,
          state: r.STATE,
          products: [],
          customerId: r.CUSTOMERID
        }

      ))
      resolve(orders);
    });
  });
}

 exports.getInternalOrdersWithState = async function (state) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM INTERNALORDER WHERE STATE = ?';
    db.all(sql, [state], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const orders = rows.map((r) => (
          {
            id: r.ID,
            issueDate: r.ISSUEDATE,
            state: r.STATE,
            products: [],
            customerId: r.CUSTOMERID
          }

      ))
      resolve(orders);
    });
  });
}

 exports.getInternalOrderWithID = async function (id) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM INTERNALORDER WHERE ID = ?';
    db.all(sql, [id], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const orders = rows.map((r) => (
          {
            id: r.ID,
            issueDate: r.ISSUEDATE,
            state: r.STATE,
            products: [],
            customerId: r.CUSTOMERID
          }

      ))
      resolve(orders);
    });
  });
}

 exports.getInternalOrderProducts = async function (internalOrderId) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM INTERNALORDERPRODUCT WHERE INTERNALORDERID = ?';
    db.all(sql, [internalOrderId], (err, rows) => {
      if (err) {
          reject(err);
          return;
      }
      resolve(rows.map((r) => (
        {
          skuid : r.SKUID,
          quantity : r.QUANTITY,
        }
      )));
      return;
    });
  });
}

exports.getSKU = async function (sku, quantityToReturn) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM SKU WHERE ID = ?';
    db.get(sql, [sku], (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      if (data == undefined){
        resolve(undefined);
        return;
      } 
      resolve(
        {
          SKUId: data.ID,
          description: data.DESCRIPTION,
          price: data.PRICE,
          qty: quantityToReturn
        }
      )
    });
  });
}

exports.getSKUItems = async function (skuid, internalOrderId) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM SKUITEM WHERE SKUID = ? AND INTERNALORDERID = ?';
    db.all(sql, [skuid, internalOrderId], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows.map((r) => (
        {
          rfid: r.RFID,
          SKUId: r.SKUID,
          available: r.AVAILABLE,
          dateOfStock: r.DATEOFSTOCK,
          internalOrderId: r.INTERNALORDERID,
          restockOrderId: r.RESTOCKORDERID
        }))
      )
    });
  });
}

exports.storeInternalOrder = async function(data) {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO INTERNALORDER(ID, ISSUEDATE, STATE, CUSTOMERID) VALUES(?, ?, ?, ?)';
    db.run(sql, [data.id, dayjs(data.issueDate).format('YYYY/MM/DD HH:mm'), data.state, data.customerId], (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

exports.storeInternalOrderProduct = async function(data){
   return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO INTERNALORDERPRODUCT(INTERNALORDERID, SKUID, QUANTITY) VALUES(?, ?, ?)';
    db.run(sql, [data.id, data.skuid, data.quantity], (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

exports.updateStateInternalOrder = async function(id, state) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE INTERNALORDER SET STATE = ? WHERE ID = ?';
    db.run(sql, [state, id], (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

exports.deleteInternalOrder = async function(id) {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM INTERNALORDER WHERE ID = ?';
    db.run(sql, [id], (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  })
}

exports.deleteInternalOrderProducts = async function(internalOrderId) {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM INTERNALORDERPRODUCT WHERE INTERNALORDERID = ?';
    db.run(sql, [internalOrderId], (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  })
}

exports.deleteAllOrders = () => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM INTERNALORDER';
    db.run(sql, [], (err, rows) => {
      if (err) {
        reject(err); return;
      }
      resolve();
    });
  });
}

exports.deleteAllProducts = () => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM INTERNALORDERPRODUCT';
    db.run(sql, [], (err, rows) => {
      if (err) {
        reject(err); return;
      }
      resolve();
    });
  });
}

exports.resetOrderAutoIncrement = () => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM SQLITE_SEQUENCE WHERE NAME='INTERNALORDER'";
    db.run(sql, [], (err, rows) => {
      if (err) {
        reject(err); return;
      }
      resolve();
    });
  });
}
exports.resetProductAutoIncrement = () => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM SQLITE_SEQUENCE WHERE NAME='INTERNALORDERPRODUCT'";
    db.run(sql, [], (err, rows) => {
      if (err) {
        reject(err); return;
      }
      resolve();
    });
  });
}