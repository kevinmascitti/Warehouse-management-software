'use strict';
const dayjs = require('dayjs');

const sqlite = require('sqlite3');
const db = new sqlite.Database('ezwhDB.db', (err) => {
  if (err) throw err;
});

exports.getOrders = async function(internalOrderId) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM RESTOCKORDER';
    db.all(sql, [internalOrderId], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      rows=rows.map((r) => ({
        id: r.ID,
        issueDate: r.ISSUEDATE,
        state: r.STATE,
        products: [],
        supplierId: r.SUPPLIERID,
        transportNote: r.STATE != 'ISSUED' ? r.TRANSPORTNOTE : undefined,
        skuItems: []
      }))
      resolve(rows);
    });
  })
  }

  exports.getProducts = async function(restockOrderId) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM RESTOCKORDERPRODUCT WHERE RESTOCKORDERID = ?';
      db.all(sql, [restockOrderId], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        rows=rows.map((r) => ({
          id: r.ID,
          restockOrderId: r.RESTOCKORDERID,
          SKUId: r.SKUID,
          quantity: r.quantity
        }))
        resolve(rows);
      });
    })
    }
  

  exports.storeOrder = async function(data) {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO RESTOCKORDER(ID, ISSUEDATE, STATE, SUPPLIERID) VALUES(?, ?, ?, ?)';
      db.run(sql, [data.id, data.issueDate, data.state, data.supplierId], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
    });
    })
  }
  
  exports.storeProduct = async function(data) {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO RESTOCKORDERPRODUCT(RESTOCKORDERID, SKUID, QUANTITY) VALUES(?, ?, ?)';
      db.run(sql, [data.restockOrderId, data.SKUId, data.quantity], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
    });
    })
  }
  