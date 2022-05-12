'use strict';

module.exports = function (app, db) {

  function storePosition(data) {
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

  function getPositions() {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM POSITION';
      db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        else if (rows===undefined){
          resolve(false);
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

  function modifyPosition(data) {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE POSITION SET ID = ?, AISLE = ?, ROW = ?, COL = ?, MAXWEIGHT = ?, MAXVOLUME = ?, OCCUPIEDWEIGHT = ?, OCCUPIEDVOLUME = ? WHERE ID = ?';
      db.run(sql, [data.newPositionID, data.aisleID, data.row, data.col, data.maxWeight, data.maxVolume, data.occupiedWeight, data.occupiedVolume, data.positionID], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        else if (rows===undefined){
          resolve(false);
        }
        else{
          resolve();
        }
      });
    });
  }

  function modifyPositionID(data) {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE POSITION SET ID = ?, AISLE = ?, ROW = ?, COL = ? WHERE ID = ?';
      db.run(sql, [data.newPositionID, data.newAisleID, data.newRow, data.newCol, data.positionID], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        else if (rows===undefined){
          resolve(false);
        }
        else{
          resolve();
        }
      });
    });
  }

  function deletePosition(data) {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM POSITION WHERE ID = ?';
      db.run(sql, [data.positionID], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        else if (rows===undefined){
          resolve(false);
        }
        else{
          resolve();
        }
      });
    });
  }

  
  //GET /api/positions
  app.get('/api/positions', async (req, res) => {
    try {
        const positions = await getPositions();
        return res.status(200).json(positions);
    } catch (err) {
      return res.status(500).json();
    }
  });

  //POST /api/position
  app.post('/api/position', async (req, res) => {
    try {
        if ( isNaN(req.body.positionID) || isNaN(req.body.aisleID)
          || isNaN(req.body.row) || isNaN(req.body.col)
          || isNaN(req.body.maxWeight) || isNan(req.body.maxVolume) 
          || req.body.aisleID.length()!=4 || req.body.row.length()!=4
          || req.body.col.length()!=4
          || req.body.positionID!=req.body.aisleID+req.body.row+req.body.col
          || Object.keys(req.body).length === 0) {
          return res.status(422).json();
        }

        const data = {
          positionID: req.body.positionID,
          aisleID: req.body.name,
          row: req.body.row,
          col: req.body.col,
          maxWeight: req.body.maxWeight,
          maxVolume: req.body.maxVolume,
          occupiedWeight: 0,
          occupiedVolume: 0
        };
        await storePosition(data);
        return res.status(201).json();
    } catch (err) {
      return res.status(503).json();
    }
  });


  //PUT /api/position/:positionID
  app.put('/api/position/:positionID', async (req, res) => {
    try {
              const position = await getPosition(req.params.positionID);
              if ( position==null ) {
                return res.status(404).json();
              }

               if ( isNaN(req.body.positionID) || isNaN(req.body.aisleID)
                  || isNaN(req.body.row) || isNaN(req.body.col)
                  || isNaN(req.body.maxWeight) || isNan(req.body.maxVolume) 
                  || req.body.aisleID.length()!=4 || req.body.row.length()!=4
                  || req.body.col.length()!=4
                  || req.body.positionID!=req.body.aisleID+req.body.row+req.body.col
                  || Object.keys(req.body).length === 0) {
                  return res.status(422).json();
                }

              const data = {
                positionID: req.params.positionID,
                aisleID: req.body.aisleID,
                row: req.body.row,
                col: req.body.column,
                maxWeight: req.body.maxWeight,
                maxVolume: req.body.maxVolume,
                occupiedWeight: req.body.occupiedWeight,
                occupiedVolume: req.body.occupiedVolume,
                newPositionID: req.body.aisleID+req.body.row+req.body.col
              };
              await modifyPosition(data);
              return res.status(200).json();

    } catch (err) {
      return res.status(503).json();
    }
  });

  //PUT /api/position/:positionID/changeID
  app.put('/api/position/:positionID/changeID', async (req, res) => {
    try {
              const position = await getPosition(req.params.positionID);
              if ( position==null ) {
                return res.status(404).json();
              }

              if ( isNaN(req.params.positionID) || isNaN(req.body.newPositionID) || Object.keys(req.body).length === 0 ) {
                 return res.status(422).json();
              }

              const data = {
                positionID: req.params.positionID,
                newPositionID: req.body.newPositionID,
                newAisleID: req.body.newPositionID.substr(0, 4),
                newRow: req.body.newPositionID.substr(4, 4),
                newCol: req.body.newPositionID.substr(8, 4)
              };
              await modifyPositionID(data);
              return res.status(200).json();

    } catch (err) {
      return res.status(503).json();
    }
  });

  //DELETE /api/position/:positionID
  app.delete('/api/position/:positionID', async (req, res) => {
    try {
              if ( isNaN(req.params.positionID) ) {
                return res.status(422).json();
              }

              await deletePosition({ positionID: req.params.positionID });
              return res.status(204).json();

    } catch (err) {
      return res.status(503).json();
    }
  });

}
