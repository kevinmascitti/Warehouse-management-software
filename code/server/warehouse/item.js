'use strict';

const sqlite = require('sqlite3');
const db = new sqlite.Database('ezwhDB.db', (err) => {
  /* istanbul ignore if */
  if (err) throw err;
});


  exports.isThereItem = (data) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT COUNT(*) AS N FROM ITEM WHERE ID = ? AND SUPPLIERID = ?';
      db.all(sql, [data.id, data.supplierId], (err, rows) => {
        if (err) {
          reject(err); return;
        }
        resolve(rows[0].N);
      });
    });
  }

  exports.isThereId = (data) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT COUNT(*) AS N FROM ITEM WHERE ID = ?';
      db.all(sql, [data.id, data.supplierId], (err, rows) => {
        if (err) {
          reject(err); return;
        }
        resolve(rows[0].N);
      });
    });
  }

  exports.getSupplierIdOfItem = (data) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT SUPPLIERID FROM ITEM WHERE ID = ?';
      db.all(sql, [data.id], (err, rows) => {
        if (err) {
          reject(err); return;
        }
        resolve(rows[0].SUPPLIERID);
      });
    });
  }

  exports.deleteAllItems = () => {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM ITEM';
      db.run(sql, [], (err, rows) => {
        if (err) {
          reject(err); return;
        }
        resolve();
      });
    });
  }

   exports.storeItem = (data) => {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO ITEM(ID, DESCRIPTION, PRICE, SKUID, SUPPLIERID) VALUES(?, ?, ?, ?, ?)';
      db.run(sql, [data.id, data.description, data.price, data.SKUId, data.supplierId], (err) => {
        if (err) {
          reject(err); return;
        }
        resolve();
      });
    });
  }

   exports.getStoredItem = (data) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM ITEM WHERE ID = ?';
      db.all(sql, [data.id], (err, rows) => {
        if (err) {
          reject(err); return;
        }
        const item = rows.map((r) => (
          {
            id: r.ID,
            description: r.DESCRIPTION,
            price: r.PRICE,
            SKUId: r.SKUID,
            supplierId: r.SUPPLIERID
          }
        ));
        resolve(item[0]);
      });
    });
  }

   exports.getStoredItems = () => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM ITEM';
      db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err); return;
        }
        const items = rows.map((r) => (
          {
            id: r.ID,
            description: r.DESCRIPTION,
            price: r.PRICE,
            SKUId: r.SKUID,
            supplierId: r.SUPPLIERID
          }
        ));
        resolve(items);
      });
    });
  }

  exports.modifyStoredItem = (data) => {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE ITEM SET DESCRIPTION = ?, PRICE = ? WHERE ID = ?';
      db.run(sql, [data.newDescription, data.newPrice, data.id], (err, rows) => {
        if (err) {
          reject(err); return;
        }
        resolve();
      });
    });
  }


   exports.deleteStoredItem = (data) => {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM ITEM WHERE ID = ?';
      db.run(sql, [data.id], (err, rows) => {
        if (err) {
          reject(err); return;
        }
        resolve();
      });
    });
  }

    /* istanbul ignore next */
   exports.supplierAlreadySellItemWithSkuid = (skuid,supplierid) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT COUNT(*) AS N FROM ITEM WHERE ITEM.SKUID = ? AND ITEM.SUPPLIERID = ?';
      db.all(sql, [skuid, supplierid], (err, rows) => {
        if (err) {
          reject(err); return;
        }
        resolve(rows[0].N);
      });
    });
   }

   exports.supplierAlreadySellThisItem = (id,supplierid) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT COUNT(*) AS N FROM ITEM WHERE ITEM.ID = ? AND ITEM.SUPPLIERID = ?';
      db.all(sql, [id, supplierid], (err, rows) => {
        if (err) {
          reject(err); return;
        }
        resolve(rows[0].N);
      });
    });
   }