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

 exports.storeSku = (data) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO SKU(DESCRIPTION, WEIGHT, VOLUME, NOTES, POSITION, AVAILABLEQUANTITY, PRICE, TESTDESCRIPTORS) VALUES(?, ?, ?, ?, ?, ?, ?, ?)';
        db.run(sql, [data.description, data.weight, data.volume, data.notes, "", data.availableQuantity, data.price, "[]"], (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}

exports.getStoredSku= (data) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM SKU WHERE ID = ?';
        db.all(sql, [data.id], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const sku = rows.map((r) => (
                {
                    description: r.DESCRIPTION,
                    weight: r.WEIGHT,
                    volume: r.VOLUME,
                    notes: r.NOTES,
                    position: r.POSITION,
                    availableQuantity: r.AVAILABLEQUANTITY,
                    price: r.PRICE,
                    testDescriptors: r.TESTDESCRIPTORS
                }
            ));
            resolve(sku);
        });
    });
}

 exports.getStoredSkus = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM SKU';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const skus = rows.map((r) => (
                {
                    id: r.ID,
                    description: r.DESCRIPTION,
                    weight: r.WEIGHT,
                    volume: r.VOLUME,
                    notes: r.NOTES,
                    position: r.POSITION,
                    availableQuantity: r.AVAILABLEQUANTITY,
                    price: r.PRICE,
                    testDescriptors: r.TESTDESCRIPTORS
                }
            ));
            resolve(skus);
        });
    });
}

exports.modifyStoredSku = (data) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE SKU SET DESCRIPTION = ?, WEIGHT = ?, VOLUME = ?, NOTES = ?, PRICE = ?, AVAILABLEQUANTITY = ? WHERE ID = ?';
        db.run(sql, [data.newDescription, data.newWeight, data.newVolume, data.newNotes, data.newPrice, data.newAvailableQuantity, data.id], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}

exports.modifySkuPosition = (data) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE SKU SET POSITION = ? WHERE ID = ?';
        db.run(sql, [data.newPosition, data.id], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}

exports.updateNewPosition = (data) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE POSITION SET OCCUPIEDWEIGHT =  OCCUPIEDWEIGHT + ?, OCCUPIEDVOLUME = OCCUPIEDVOLUME + ? WHERE ID = ?';
        db.run(sql, [data.availableQuantity * data.weight, data.availableQuantity * data.volume, data.newPosition], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}

exports.updateOldPosition = (data) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE POSITION SET OCCUPIEDWEIGHT = OCCUPIEDWEIGHT - ?, OCCUPIEDVOLUME = OCCUPIEDVOLUME - ? WHERE ID = ?';
        db.run(sql, [data.availableQuantity * data.weight, data.availableQuantity * data.volume, data.oldPosition], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}

exports.deleteStoredSku = (data) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM SKU WHERE ID = ?';
        db.run(sql, [data.id], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}
