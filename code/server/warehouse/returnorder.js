'use strict';
const dayjs = require('dayjs');

const sqlite = require('sqlite3');
const db = new sqlite.Database('ezwhDB.db', (err) => {
    if (err) throw err;
});

exports.getOrders = async function() {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM RETURNORDER';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            rows = rows.map((r) => ({
                id: r.ID,
                returnDate: r.RETURNDATE,
                products: [],
                restockOrderId: r.RESTOCKORDERID
            }))
            resolve(rows);
        });
    })
}




exports.getOrderById = async function (params) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM RETURNORDER WHERE ID = ?';
        db.get(sql, [params.id], (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            if (data == undefined) {
                resolve(undefined);
                return;
            }
            let row = {
                id: data.ID,
                returnDate: data.RETURNDATE,
                products: [],
                restockOrderId: data.RESTOCKORDERID
            }
            resolve(row);
        })
    });
}



exports.storeOrder = async function (data) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO RETURNORDER VALUES (?, ?, ?)';
        db.run(sql, [data.id, data.returnDate, data.restockOrderId], (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        })
    });
}


exports.deleteOrder = async function (data) {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM RETURNORDER WHERE ID = ?';
        db.run(sql, [data.id], (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        })
    });
}