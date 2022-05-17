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
    db.all(sql, state, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const orders = rows.map((r) => (
        {
          sku: r.ID,
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
          sku: r.ID,
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

 exports.getProductsOrdered = async function (internalOrderId) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM PRODUCTORDERED WHERE INTERNALORDERID = ?';
    db.all(sql, [internalOrderId], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows.map((r) => (
        {
          skuid: r.SKUID,
          quantity: r.QUANTITY,
          rfid: r.RFID
        }
      )));
      return;
    });
  });
}

 exports.getItemInfoForInternalOrder = async function (sku, quantity) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM SKU WHERE ID = ?';
    db.get(sql, [sku], (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(
        {
          SKUId: data.ID,
          description: data.DESCRIPTION,
          price: data.PRICE,
          quantity: quantity
        }
      )
    });
  });
}

 exports.storeInternalOrder= (data) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO INTERNALORDER(ID, ISSUEDATE, STATE, CUSTOMERID) VALUES(?, ?, ?, ?)';
    db.run(sql, [data.id, dayjs(data.issueDate).format('YYYY/MM/DD HH:MM'), data.state, data.customerId], (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

exports.storeProductOrdered = (data)  =>{
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO PRODUCTORDERED(INTERNALORDERID, SKUID, QUANTITY, RFID) VALUES(?, ?, ?, ?)';
    db.run(sql, [data.id, data.skuid, data.quantity, data.rfid], (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

exports.updateStateInternalOrder = (id, state) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE INTERNALORDER SET STATE = ? WHERE ID = ?';
    console.log(id, state)
    db.run(sql, [state, id], (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

 exports.updateProductOrdered = (sku, internalOrderId, rfid) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE PRODUCTORDERED SET RFID = ? WHERE INTERNALORDERID = ? AND SKUID = ?';
    db.run(sql, [rfid, internalOrderId, sku], (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

 exports.deleteInternalOrder = (id) => {
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

 exports.deleteProductsOrdered = (internalOrderId) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM PRODUCTORDERED WHERE INTERNALORDERID = ?';
    db.run(sql, [internalOrderId], (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  })
}
