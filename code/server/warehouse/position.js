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

  function isTherePosition(data) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT COUNT(*) AS N FROM POSITION WHERE ID = ?';
        db.all(sql, [data.id], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            else if (rows===undefined){
              resolve(false);
            }
            else{
              resolve(rows[0].N);
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
        const r = req.body;
        if ( r.positionID===undefined || r.positionID===null
          || r.aisleID===undefined || r.aisleID===null
          || r.row===undefined || r.row===null
          || r.col===undefined || r.col===null
          || isNaN(r.maxWeight) || r.maxWeight<=0
          || isNaN(r.maxVolume) || r.maxVolume<=0
          || r.positionID.length!=12
          || r.aisleID.length!=4 
          || r.row.length!=4
          || r.col.length!=4
          || r.positionID!==r.aisleID+r.row+r.col
          || Object.keys(r).length===0 ) {
            return res.status(422).json();
        }

        const data = {
          positionID: req.body.positionID,
          aisleID: req.body.aisleID,
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
          if ( req.param.positionID===undefined || req.param.positionID===null
            || req.body.aisleID===undefined || req.body.aisleID===null
            || req.body.row===undefined || req.body.row===null
            || req.body.col===undefined || req.body.col===null
            || isNaN(req.body.maxWeight) || req.body.maxWeight<=0
            || isNaN(req.body.maxVolume) || req.body.maxVolume<=0
            || req.param.positionID.length!=12
            || req.body.aisleID.length!=4 
            || req.body.row.length!=4
            || req.body.col.length!=4
            || req.param.positionID!==req.body.aisleID+req.body.row+req.body.col
            || Object.keys(req.body).length===0 ) {
                return res.status(422).json();
            }
              
              const N = await isTherePosition({ id: req.body.positionID });
              if (N == 1) {
                  const position = await getPosition({ id: req.body.positionID });
                  const data = {
                    positionID: position.positionID,
                    aisleID: position.aisleID,
                    row: position.row,
                    col: position.column,
                    maxWeight: position.maxWeight,
                    maxVolume: position.maxVolume,
                    occupiedWeight: position.occupiedWeight,
                    occupiedVolume: position.occupiedVolume,
                    newPositionID: position.aisleID+position.row+position.col
                  };
                  await modifyPosition(data);
                  const result = await getPosition({ id: req.body.newPositionID });
                  return res.status(200).json(result);
              }
              return res.status(404).json();


              
              return res.status(200).json();

    } catch (err) {
      return res.status(503).json();
    }
  });

  //PUT /api/position/:positionID/changeID
  app.put('/api/position/:positionID/changeID', async (req, res) => {
    try {

              if ( req.params.positionID===undefined || req.params.positionID===null
                || req.body.newPositionID===undefined || req.params.newPositionID===null
                || req.params.positionID.length!=12 || req.params.newPositionID.length!=12
                || Object.keys(req.body).length === 0 ) {
                 return res.status(422).json();
              }
              const N = await isTherePosition({ id: req.params.positionID });
              if (N == 1) {
                const position = await getPosition({ id: req.params.positionID });
                const data = {
                  positionID: req.params.positionID,
                  newPositionID: req.body.newPositionID,
                  newAisleID: req.body.newPositionID.substr(0, 4),
                  newRow: req.body.newPositionID.substr(4, 4),
                  newCol: req.body.newPositionID.substr(8, 4)
                };
                await modifyPositionID(data);
                return res.status(200).json();
              }
              return res.status(404).json();

    } catch (err) {
      return res.status(503).json();
    }
  });

  //DELETE /api/position/:positionID
  app.delete('/api/position/:positionID', async (req, res) => {
    try {
              if ( req.params.positionID===undefined || req.params.positionID===null
                  || req.params.positionID.length!=12 ) {
                return res.status(422).json();
              }

              await deletePosition({ positionID: req.params.positionID });
              return res.status(204).json();

    } catch (err) {
      return res.status(503).json();
    }
  });

}
