'use strict';

const sqlite = require('sqlite3');
const db = new sqlite.Database('ezwhDB.db', (err) => {
  if (err) throw err;
});

   exports.storePosition = (data) => {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO POSITION(ID, AISLE, ROW, COLUMN, MAXWEIGHT, MAXVOLUME, OCCUPIEDWEIGHT, OCCUPIEDVOLUME) VALUES(?, ?, ?, ?, ?, ?, ?, ?)';
      db.run(sql, [data.positionID, data.aisleID, data.row, data.col, data.maxWeight, data.maxVolume, data.occupiedWeight, data.occupiedVolume], (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }

   exports.getPositions = () => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM POSITION';
      db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        else{
          const positions = rows.map((r) => (
            {
              positionID: r.ID,
              aisleID: r.AISLE,
              row: r.ROW,
              col: r.COLUMN,
              maxWeight: r.MAXWEIGHT,
              maxVolume: r.MAXVOLUME,
              occupiedWeight: r.OCCUPIEDWEIGHT,
              occupiedVolume: r.OCCUPIEDVOLUME
            }
          ));
          resolve(positions);
        }
      });
    });
  }

  exports.getPosition = (data) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM POSITION WHERE ID = ?';
      db.all(sql, [data.positionID], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        else{
          const position = rows.map((r) => (
            {
              positionID: r.ID,
              aisleID: r.AISLE,
              row: r.ROW,
              col: r.COLUMN,
              maxWeight: r.MAXWEIGHT,
              maxVolume: r.MAXVOLUME,
              occupiedWeight: r.OCCUPIEDWEIGHT,
              occupiedVolume: r.OCCUPIEDVOLUME
            }
          ));
          resolve(position[0]);
        }
      });
    });
  }

  exports.isTherePosition = (data) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT COUNT(*) AS N FROM POSITION WHERE ID = ?';
        db.all(sql, [data.id], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            else{
              resolve(rows[0].N);
            }
        });
    });
}

  exports.modifyPosition = (data) => {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE POSITION SET ID = ?, AISLE = ?, ROW = ?, COLUMN = ?, MAXWEIGHT = ?, MAXVOLUME = ?, OCCUPIEDWEIGHT = ?, OCCUPIEDVOLUME = ? WHERE ID = ?';
      db.run(sql, [data.newPositionID, data.newAisleID, data.newRow, data.newCol, data.newMaxWeight, data.newMaxVolume, data.newOccupiedWeight, data.newOccupiedVolume, data.positionID], (err) => {
        if (err) {
          reject(err);
          return;
        }
        else{
          resolve();
        }
      });
    });
  }

  exports.modifyPositionID = (data) => {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE POSITION SET ID = ?, AISLE = ?, ROW = ?, COLUMN = ? WHERE ID = ?';
      db.run(sql, [data.newPositionID, data.newAisleID, data.newRow, data.newCol, data.positionID], (err) => {
        if (err) {
          reject(err);
          return;
        }
        else{
          resolve();
        }
      });
    });
  }

  exports.deletePosition = (data) => {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM POSITION WHERE ID = ?';
      db.run(sql, [data.positionID], (err) => {
        if (err) {
          reject(err);
          return;
        }
        else{
          resolve();
        }
      });
    });
  }

  exports.deleteAllPositions = () => {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM POSITION';
      db.run(sql, [], (err) => {
        if (err) {
          reject(err);
          return;
        }
        else{
          resolve();
        }
      });
    });
  }