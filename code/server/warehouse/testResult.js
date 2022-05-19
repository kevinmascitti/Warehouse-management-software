'use strict';

const sqlite = require('sqlite3');
const db = new sqlite.Database('ezwhDB.db', (err) => {
    if (err) throw err;
});

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

exports.isThereTestResult = (data) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT COUNT(*) AS N FROM TESTRESULT WHERE ID = ?';
        db.all(sql, [data.id], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows[0].N);
        });
    });
}

exports.getStoredTestResults = (data) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM TESTRESULT WHERE SKURFID = ?';
        db.all(sql, [data.rfid], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const testResults = rows.map((r) => (
                {
                    id: r.ID,
                    idTestDescriptor: r.IDTESTDESCRIPTOR,
                    Date: r.DATE,
                    Result: r.RESULT
                }
            ));
            resolve(testResults);
        });
    });
}

exports.getStoredTestResult = (data) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM TESTRESULT WHERE SKURFID = ? AND ID = ?';
        db.all(sql, [data.rfid, data.id], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const testResult = rows.map((r) => (
                {
                    id: r.ID,
                    idTestDescriptor: r.IDTESTDESCRIPTOR,
                    Date: r.DATE,
                    Result: r.RESULT
                }
            ));
            resolve(testResult);
        });
    });
}

exports.storeTestResult = (data) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO TESTRESULT(SKURFID, IDTESTDESCRIPTOR, DATE, RESULT) VALUES(?, ?, ?, ?)';
        db.run(sql, [data.rfid, data.idTestDescriptor, data.Date, data.Result], (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}

exports.modifyStoredTestResult = (data) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE TESTRESULT SET IDTESTDESCRIPTOR = ?, DATE = ?, RESULT = ? WHERE ID = ? AND SKURFID = ?';
        db.run(sql, [data.newIdTestDescriptor, data.newDate, data.newResult, data.id, data.rfid], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}

exports.deleteStoredTestResult = (data) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM TESTRESULT WHERE ID = ? AND SKURFID = ?';
        db.run(sql, [data.id, data.rfid], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}
