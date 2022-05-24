'use strict';

const sqlite = require('sqlite3');
const db = new sqlite.Database('ezwhDB.db', (err) => {
    /* istanbul ignore if */ //ESCLUDO DA COVERAGE
    if (err) throw err;
});

 exports.isThereSku = (data) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT COUNT(*) AS N FROM SKU WHERE ID = ?';
        db.all(sql, [data.id], (err, rows) => {
            if (err) {
                reject(err); return;
            }
            resolve(rows[0].N);
        });
    });
}

 exports.storeSku = (data) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO SKU(DESCRIPTION, WEIGHT, VOLUME, NOTES, AVAILABLEQUANTITY, PRICE, TESTDESCRIPTORS) VALUES(?, ?, ?, ?, ?, ?, ?)';
        db.run(sql, [data.description, data.weight, data.volume, data.notes, data.availableQuantity, data.price, '[]'], (err) => {
            if (err) {
                reject(err); return;
            }
            resolve();
        });
    });
}

/* istanbul ignore next */ //FUNZIONE DA TOGLIERE MATTEO?????
exports.storeSkuWithId = (data) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO SKU(ID, DESCRIPTION, WEIGHT, VOLUME, NOTES, POSITION, AVAILABLEQUANTITY, PRICE, TESTDESCRIPTORS) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)';
        db.run(sql, [data.id, data.description, data.weight, data.volume, data.notes, "", data.availableQuantity, data.price, "[]"], (err) => {
            if (err) {
                reject(err); return;
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
                reject(err); return;
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
                    testDescriptors: JSON.parse(r.TESTDESCRIPTORS)
                }
            ));
            resolve(sku[0]);
        });
    });
}

 exports.getStoredSkus = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM SKU';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err); return;
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
                    testDescriptors: JSON.parse(r.TESTDESCRIPTORS)
                }
            ));
            resolve(skus);
        });
    });
}

exports.modifyStoredSku = (data) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE SKU SET DESCRIPTION = ?, WEIGHT = ?, VOLUME = ?, NOTES = ?, PRICE = ?, AVAILABLEQUANTITY = ?, TESTDESCRIPTORS = ? WHERE ID = ?';
        db.run(sql, [data.newDescription, data.newWeight, data.newVolume, data.newNotes, data.newPrice, data.newAvailableQuantity, data.newTestDescriptors ? '['+data.newTestDescriptors.toString()+']' : '[]',data.id], (err, rows) => {
            if (err) {
                reject(err); return;
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
                reject(err); return;
            }
            resolve();
        });
    });
}

/* istanbul ignore next */ //ESCLUDO DA COVERAGE
exports.getSkuPosition = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT POSITION.ID AS POSID, OCCUPIEDWEIGHT, OCCUPIEDVOLUME, MAXWEIGHT, MAXVOLUME FROM SKU, POSITION WHERE SKU.POSITION = POSITION.ID AND SKU.ID = ?';
        db.all(sql, [id], (err, rows) => {
            if (err) {
                reject(err); return;
            }
            const skuPos = rows.map((r) => (
                {
                    id: r.POSID,
                    occupiedWeight: r.OCCUPIEDWEIGHT,
                    occupiedVolume: r.OCCUPIEDVOLUME,
                    maxWeight: r.MAXWEIGHT,
                    maxVolume: r.MAXVOLUME
                }
            ));
            resolve(skuPos[0]);
        });
    });
}

/* istanbul ignore next */ //ESCLUDO DA COVERAGE
exports.getPositionInfos = (position) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT OCCUPIEDWEIGHT, OCCUPIEDVOLUME, MAXWEIGHT, MAXVOLUME FROM POSITION WHERE ID = ?';
        db.all(sql, [position], (err, rows) => {
            if (err) {
                reject(err); return;
            }
            const infos = rows.map((r) => (
                {
                    occupiedWeight: r.OCCUPIEDWEIGHT,
                    occupiedVolume: r.OCCUPIEDVOLUME,
                    maxWeight: r.MAXWEIGHT,
                    maxVolume: r.MAXVOLUME
                }
            ));
            resolve(infos[0]);
        });
    });
}

exports.isPositionAlreadyAssignedToOtherSku = (id, position) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT COUNT(*) AS N FROM SKU WHERE POSITION = ? AND ID != ?';
        db.all(sql, [position, id], (err, rows) => {
            if (err) {
                reject(err); return;
            }
            if(rows[0].N == 0){
                resolve(false);
            }
            else{
                resolve(true);   
            }
        });
    });
}

/* istanbul ignore next */ //ESCLUDO DA COVERAGE
exports.updateNewPosition = (data) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE POSITION SET OCCUPIEDWEIGHT =  OCCUPIEDWEIGHT + ?, OCCUPIEDVOLUME = OCCUPIEDVOLUME + ? WHERE ID = ?';
        db.run(sql, [data.weight*data.availableQuantity, data.volume*data.availableQuantity, data.newPosition], (err, rows) => {
            if (err) {
                reject(err); return;
            }
            resolve();
        });
    });
}

/* istanbul ignore next */ //ESCLUDO DA COVERAGE
exports.updateOldPosition = (data) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE POSITION SET OCCUPIEDWEIGHT = OCCUPIEDWEIGHT - ?, OCCUPIEDVOLUME = OCCUPIEDVOLUME - ? WHERE ID = ?';
        db.run(sql, [data.weight*data.availableQuantity, data.volume*data.availableQuantity, data.oldPosition], (err, rows) => {
            if (err) {
                reject(err); return;
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
                reject(err); return;
            }
            resolve();
        });
    });
}

exports.deleteAllSkus = () => {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM SKU';
      db.run(sql, [], (err, rows) => {
        if (err) {
          reject(err); return;
        }
        resolve();
      });
    });
  }

  exports.resetSkuAutoIncrement = () => {
    return new Promise((resolve, reject) => {
      const sql = "DELETE FROM SQLITE_SEQUENCE WHERE NAME='SKU'";
      db.run(sql, [], (err, rows) => {
        if (err) {
          reject(err); return;
        }
        resolve();
      });
    });
  }