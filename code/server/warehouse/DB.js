class DB {

    sqlite = require('sqlite3');

    constructor() {
        this.db = new this.sqlite.Database('ezwhDB.db', (err) => {
            if (err) throw err;
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

}

module.exports = DB;