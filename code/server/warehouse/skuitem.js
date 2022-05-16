'use strict';

const sqlite = require('sqlite3');
const db = new sqlite.Database('ezwhDB.db', (err) => {
  if (err) throw err;
});

    exports.isThereSku = (data) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT COUNT(*) AS N FROM SKU WHERE ID = ?';
            db.all(sql, [data.id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows[0].N);
            });
        });
    }

    exports.getStoredSkuitemsForSkuid = (data) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT RFID,SKUID,DATEOFSTOCK FROM SKUITEM, SKU WHERE SKUITEM.SKUID=SKU.ID AND AVAILABLE=1 AND SKU.ID=?';
            db.all(sql, [data.id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const skuitems = rows.map((r) => (
                    {
                        RFID: r.RFID,
                        SKUId: r.SKUID,
                        DateOfStock: r.DATEOFSTOCK
                    }
                ));
                resolve(skuitems);
            });
        });
    }

    exports.isThereSkuitem = (data) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT COUNT(*) AS N FROM SKUITEM WHERE RFID = ?';
            db.all(sql, [data.rfid], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows[0].N);
            });
        });
    }

    exports.storeSkuitem = (data) => {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO SKUITEM(RFID, SKUID, AVAILABLE, DATEOFSTOCK) VALUES(?, ?, ?, ?)';
            db.run(sql, [data.rfid, data.skuid, 0, data.dateofstock], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

     exports.getStoredSkuitem = (data) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM SKUITEM WHERE RFID = ?';
            db.all(sql, [data.rfid], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const skuitem = rows.map((r) => (
                    {
                        RFID: r.RFID,
                        SKUId: r.SKUID,
                        Available: r.AVAILABLE,
                        DateOfStock: r.DATEOFSTOCK
                    }
                ));
                resolve(skuitem);
            });
        });
    }

    exports.getStoredSkuitems = () => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM SKUITEM';
            db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const skuitems = rows.map((r) => (
                    {
                        RFID: r.RFID,
                        SKUId: r.SKUID,
                        Available: r.AVAILABLE,
                        DateOfStock: r.DATEOFSTOCK,
                    }
                ));
                resolve(skuitems);
            });
        });
    }

    exports.modifyStoredSkuitem = (data) => {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE SKUITEM SET RFID = ?, AVAILABLE = ?, DATEOFSTOCK = ? WHERE RFID = ?';
            db.run(sql, [data.newRFID, data.newAvailable, data.newDateOfStock, data.oldRFID], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    exports.deleteStoredSkuitem = (data) => {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM SKUITEM WHERE RFID = ?';
            db.run(sql, [data.rfid], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }
