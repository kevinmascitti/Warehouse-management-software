'use strict';

const sqlite = require('sqlite3');
const db = new sqlite.Database('ezwhDB.db', (err) => {
    /* istanbul ignore if */
    if (err) throw err;
});

exports.getStoredSkuitemsForSkuid = (data) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT RFID,SKUID,DATEOFSTOCK FROM SKUITEM WHERE AVAILABLE=1 AND SKUITEM.SKUID=?';
        db.all(sql, [data.id], (err, rows) => {
            if (err) {
                reject(err); return;
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
                reject(err); return;
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
                reject(err); return;
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
                reject(err); return;
            }
            const skuitem = rows.map((r) => (
                {
                    RFID: r.RFID,
                    SKUId: r.SKUID,
                    Available: r.AVAILABLE,
                    DateOfStock: r.DATEOFSTOCK
                }
            ));
            resolve(skuitem[0]);
        });
    });
}

exports.getStoredSkuitems = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM SKUITEM';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err); return;
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
                reject(err); return;
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
                reject(err); return;
            }
            resolve();
        });
    });
}

exports.deleteAllSkuitems = () => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM SKUITEM';
        db.run(sql, [], (err, rows) => {
            if (err) {
                reject(err); return;
            }
            resolve();
        });
    });
}

/* istanbul ignore next */ //ESCLUDO DA COVERAGE
exports.getStoredSkuitemsForRestockOrder = (data) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM SKUITEM WHERE RESTOCKORDERID = ?';
        db.all(sql, [data.id], (err, rows) => {
            if (err) {
                reject(err); return;
            }
            const skuitems = rows.map((r) => (
                {
                    rfid: r.RFID,
                    SKUId: r.SKUID,
                    DateOfStock: r.DATEOFSTOCK,
                    returnOrderID: r.RETURNORDERID
                }
            ));
            resolve(skuitems);
        });
    });
}


exports.getStoredSkuitemsForReturnOrder = (data) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM SKUITEM WHERE RETURNORDERID = ?';
        db.all(sql, [data.id], (err, rows) => {
            if (err) {
                reject(err); return;
            }
            const skuitems = rows.map((r) => (
                {
                    rfid: r.RFID,
                    SKUId: r.SKUID,
                    DateOfStock: r.DATEOFSTOCK,
                    returnOrderID: r.RETURNORDERID
                }
            ));
            resolve(skuitems);
        });
    });
}

/* istanbul ignore next */ //ESCLUDO DA COVERAGE
exports.setRestockOrder = (data) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE SKUITEM SET RESTOCKORDERID = ? WHERE RFID = ?';
        db.run(sql, [data.restockOrderId, data.rfid], (err, rows) => {
            if (err) {
                reject(err); return;
            }
            resolve();
        });
    });
}


/* istanbul ignore next */ //ESCLUDO DA COVERAGE
exports.setReturn = (data) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE SKUITEM SET RESTOCKORDERID = ?, RETURNORDERID = ? WHERE RFID = ?';
        db.run(sql, [data.restockOrderId, data.returnOrderId, data.rfid], (err, rows) => {
            if (err) {
                reject(err); return;
            }
            resolve();
        });
    });
}


/* istanbul ignore next */ //ESCLUDO DA COVERAGE
exports.setAvailabe = (data) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE SKUITEM SET AVAILABLE = 1 WHERE RFID = ?';
        db.run(sql, [data.rfid], (err, rows) => {
            if (err) {
                reject(err); return;
            }
            resolve();
        });
    });
}


/* istanbul ignore next */ //ESCLUDO DA COVERAGE
exports.getItemsToReturn = (data) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM SKUITEM WHERE RESTOCKORDERID = ? AND RETURNORDERID != 0';
        db.all(sql, [data.restockOrderId], (err, rows) => {
            if (err) {
                reject(err); return;
            }
            let skuitems = rows.map((r) => ({
                SKUId: r.SKUID,
                rfid: r.RFID
            }))
            resolve(skuitems);
        });
    });
}


/* istanbul ignore next */ //ESCLUDO DA COVERAGE
exports.setInternalOrder = (data) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE SKUITEM SET INTERNALORDERID = ? WHERE RFID = ?';
        db.run(sql, [data.internalOrderId, data.rfid], (err, rows) => {
            if (err) {
                reject(err); return;
            }
            resolve();
        });
    });
}

/* istanbul ignore next */ //ESCLUDO DA COVERAGE
exports.getByInternalAndSKU = async function (data) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM SKUITEM WHERE SKUID = ? AND INTERNALORDERID = ?';
        db.all(sql, [data.SKUId, data.internalOrderId], (err, rows) => {
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