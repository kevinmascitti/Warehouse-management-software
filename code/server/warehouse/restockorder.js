'use strict';

const dayjs = require('dayjs');
const sqlite = require('sqlite3');
const db = new sqlite.Database('ezwhDB.db', (err) => {
  if (err) throw err;
});

exports.getOrders = async function () {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM RESTOCKORDER';
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      rows = rows.map((r) => ({
        id: r.ID,
        issueDate: r.ISSUEDATE,
        state: r.STATE,
        products: [],
        supplierId: r.SUPPLIERID,
        transportNote: (r.STATE != 'ISSUED' && r.TRANSPORTNOTE != null) ? r.TRANSPORTNOTE : undefined,
        skuItems: []
      }))
      resolve(rows);
    });
  })
}

exports.getOrderById = async function (params) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM RESTOCKORDER WHERE ID = ?';
    db.get(sql, [params.id], (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      if (data == undefined) {
        resolve(undefined);
        return;
      }
      let transportNote = data.TRANSPORTNOTE != null ? {deliveryDate: dayjs(data.TRANSPORTNOTE).format("YYYY/MM/DD HH:mm")} : undefined;
      let row = {
        id: data.ID,
        issueDate: data.ISSUEDATE,
        state: data.STATE,
        products: [],
        supplierId: data.SUPPLIERID,
        transportNote: (data.STATE != 'ISSUED') ? transportNote : undefined,
        skuItems: []
      }
      resolve(row);
    })
  });
}

exports.getOrdersIssued = async function () {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM RESTOCKORDER WHERE STATE = ?';
    db.all(sql, ['ISSUED'], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      rows = rows.map((r) => ({
        id: r.ID,
        issueDate: r.ISSUEDATE,
        state: r.STATE,
        products: [],
        supplierId: r.SUPPLIERID,
        transportNote: (r.STATE != 'ISSUED' && r.TRANSPORTNOTE != null) ? r.TRANSPORTNOTE : undefined,
        skuItems: []
      }))
      resolve(rows);
    });
  })
}


exports.getProducts = async function (restockOrderId) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM RESTOCKORDERPRODUCT WHERE RESTOCKORDERID = ?';
    db.all(sql, [restockOrderId], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      rows = rows.map((r) => ({
        id: r.ID,
        restockOrderId: r.RESTOCKORDERID,
        itemId: r.ITEMID,
        quantity: r.QUANTITY
      }))
      resolve(rows);
    });
  })
}


exports.storeOrder = async function (data) {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO RESTOCKORDER(ID, ISSUEDATE, STATE, SUPPLIERID) VALUES(?, ?, ?, ?)';
    db.run(sql, [data.id, data.issueDate, "ISSUED", data.supplierId], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  })
}

exports.storeProduct = async function (data) {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO RESTOCKORDERPRODUCT(RESTOCKORDERID, ITEMID, QUANTITY) VALUES(?, ?, ?)';
    db.run(sql, [data.restockOrderId, data.itemId, data.quantity], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  })
}


exports.setNewState = async function (data) {
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
    db.run(sql, [data.transportNote, data.id], (err, rows) => {
      if (err) {
        reject(err); return;
      }
      resolve();
    });
  });
}

exports.deleteOrder = async function (data) {
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

exports.deleteProducts = async function (data) {
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


exports.deleteAllOrders = async function () {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM RESTOCKORDER';
    db.run(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  })
}

exports.deleteAllProducts = async function () {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM RESTOCKORDERPRODUCT;';
    db.run(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  })
}



exports.resetAutoIncrement = () => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM SQLITE_SEQUENCE WHERE NAME='RESTOCKORDER'";
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
    const sql = "DELETE FROM SQLITE_SEQUENCE WHERE NAME='RESTOCKORDERPRODUCT'";
    db.run(sql, [], (err, rows) => {
      if (err) {
        reject(err); return;
      }
      resolve();
    });
  });
}