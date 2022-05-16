'use strict';

const sqlite = require('sqlite3');
const db = new sqlite.Database('ezwhDB.db', (err) => {
    if (err) throw err;
});

exports.getStoredTestDescriptors = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM TESTDESCRIPTOR';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const testDescriptors = rows.map((r) => (
                {
                    id: r.ID,
                    name: r.NAME,
                    procedureDescription: r.PROCEDUREDESCRIPTION,
                    idSKU: r.IDSKU
                }
            ));
            resolve(testDescriptors);
        });
    });
}

exports.getStoredTestDescriptor = (data) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM TESTDESCRIPTOR WHERE ID = ?';
        db.all(sql, [data.id], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const testDescriptor = rows.map((r) => (
                {
                    id: r.ID,
                    name: r.NAME,
                    procedureDescription: r.PROCEDUREDESCRIPTION,
                    idSKU: r.IDSKU
                }
            ));
            resolve(testDescriptor);
        });
    });
}

exports.isThereTestDescriptor = (data) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT COUNT(*) AS N FROM TESTDESCRIPTOR WHERE ID = ?';
        db.all(sql, [data.id], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows[0].N);
        });
    });
}

exports.storeTestDescriptor = (data) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO TESTDESCRIPTOR(NAME, PROCEDUREDESCRIPTION, IDSKU) VALUES(?, ?, ?)';
        db.run(sql, [data.name, data.procedureDescription, data.idSKU], (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}

 exports.modifyStoredTestDescriptor = (data) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE TESTDESCRIPTOR SET NAME = ?, PROCEDUREDESCRIPTION = ?, IDSKU = ? WHERE ID = ?';
        db.run(sql, [data.newName, data.newProcedureDescription, data.newIdSKU, data.id], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}

exports.deleteStoredTestDescriptor = (data) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM TESTDESCRIPTOR WHERE ID = ?';
        db.run(sql, [data.id], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}
