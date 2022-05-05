class DB {

    sqlite = require('sqlite3');

    constructor() {
        this.db = new this.sqlite.Database('ezwhDB.db', (err) => {
            if (err) throw err;
        });
    }

    isThereItem(data) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT COUNT(*) AS N FROM ITEM WHERE ID = ?';
            this.db.all(sql, [data.id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows[0].N);
            });
        });
    }

    storeItem(data) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO ITEM(ID, DESCRIPTION, PRICE, SKUID, SUPPLIERID) VALUES(?, ?, ?, ?, ?)';
            this.db.run(sql, [data.id, data.description, data.price, data.SKUId, data.supplierId], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    getStoredItem(data) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM ITEM WHERE ID = ?';
            this.db.all(sql, [data.id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
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
                resolve(item);
            });
        });
    }

    getStoredItems() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM ITEM';
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
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

    modifyStoredItem(data) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE ITEM SET DESCRIPTION = ?, PRICE = ? WHERE ID = ?';
            this.db.run(sql, [data.newDescription, data.newPrice, data.id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }


    deleteStoredItem(data) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM ITEM WHERE ID = ?';
            this.db.run(sql, [data.id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    isThereSku(data) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT COUNT(*) AS N FROM SKU WHERE ID = ?';
            this.db.all(sql, [data.id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows[0].N);
            });
        });
    }

    storeSku(data) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO SKU(DESCRIPTION, WEIGHT, VOLUME, NOTES, POSITION, AVAILABLEQUANTITY, PRICE, TESTDESCRIPTORS) VALUES(?, ?, ?, ?, ?, ?, ?, ?)';
            this.db.run(sql, [data.description, data.weight, data.volume, data.notes, "", data.availableQuantity, data.price, "[]"], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    getStoredSku(data) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM SKU WHERE ID = ?';
            this.db.all(sql, [data.id], (err, rows) => {
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

    getStoredSkus() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM SKU';
            this.db.all(sql, [], (err, rows) => {
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

    modifyStoredSku(data) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE SKU SET DESCRIPTION = ?, WEIGHT = ?, VOLUME = ?, NOTES = ?, PRICE = ?, AVAILABLEQUANTITY = ? WHERE ID = ?';
            this.db.run(sql, [data.newDescription, data.newWeight, data.newVolume, data.newNotes, data.newPrice, data.newAvailableQuantity, data.id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    deleteStoredSku(data) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM SKU WHERE ID = ?';
            this.db.run(sql, [data.id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

}

module.exports = DB;