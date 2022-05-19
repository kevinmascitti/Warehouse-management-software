'use strict';

const sqlite = require('sqlite3');
const db = new sqlite.Database('ezwhDB.db', (err) => {
  if (err) throw err;
});

exports.getOrders = async function() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM RESTOCKORDER';
    db.all(sql, [], (err, rows) => {
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

  exports.getOrderById = async function(params) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM RESTOCKORDER WHERE ID = ?';
      db.get(sql, [params.id], (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        if (data == undefined){
          resolve(undefined);
          return;
        } 
        let row={
          id: data.ID,
          issueDate: data.ISSUEDATE,
          state: data.STATE,
          products: [],
          supplierId: data.SUPPLIERID,
          transportNote: data.STATE != 'ISSUED' ? data.TRANSPORTNOTE : undefined,
          skuItems: []
        }
        resolve(row);
      })
      });
    }
  
exports.getOrdersIssued = async function() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM RESTOCKORDER WHERE STATE = ?';
    db.all(sql, ['ISSUED'], (err, rows) => {
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
          quantity: r.QUANTITY
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


  exports.setNewState = async function(data) {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE RESTOCKORDER SET STATE = ? WHERE ID = ?';
      db.run(sql, [data.state, data.id], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
    });
    })
    
  }

  exports.setTransportNote = (data) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE RESTOCKORDER SET TRANSPORTNOTE = ? WHERE ID = ?';
        db.run(sql, [JSON.stringify(data.transportNote).toString(), data.id], (err, rows) => {
            if (err) {
                reject(err); return;
            }
            resolve();
        });
    });
}
  
  exports.deleteOrder = async function(data) {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM RESTOCKORDER WHERE ID = ?';
      db.run(sql, [data.id], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
    });
    })
  }

  exports.deleteProducts = async function(data) {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM RESTOCKORDERPRODUCT WHERE RESTOCKORDERID = ?';
      db.run(sql, [data.id], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
    });
    })
    
  }
