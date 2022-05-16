'use strict';

const sqlite = require('sqlite3');
const db = new sqlite.Database('ezwhDB.db', (err) => {
  /* istanbul ignore if */
  if (err) throw err;
});


  exports.isThereItem = (data) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT COUNT(*) AS N FROM ITEM WHERE ID = ?';
      db.all(sql, [data.id], (err, rows) => {
        /* istanbul ignore if */
        if (err) {
          reject(err); return;
        }
        resolve(rows[0].N);
      });
    });
  }

  exports.deleteAllItems = () => {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM ITEM';
      db.run(sql, [], (err, rows) => {
        /* istanbul ignore if */
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
        /* istanbul ignore if */
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
        /* istanbul ignore if */
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
        /* istanbul ignore if */
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
        /* istanbul ignore if */
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
        /* istanbul ignore if */
        if (err) {
          reject(err); return;
        }
        resolve();
      });
    });
  }


  