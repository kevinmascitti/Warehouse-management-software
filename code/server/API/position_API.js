'use strict';
const pos = require('../warehouse/position');

module.exports = function (app) {

  //GET /api/positions
  app.get('/api/positions', async (req, res) => {
    try {
        const positions = await pos.getPositions();
        return res.status(200).json(positions);
    } catch (err) {
      return res.status(500).json();
    }
  });

  //POST /api/position
  app.post('/api/position', async (req, res) => {
    try {
      let re = new RegExp('^[0-9]+$');
        if ( req.body.positionID===undefined || req.body.positionID===null
          || req.body.aisleID===undefined || req.body.aisleID===null
          || req.body.row===undefined || req.body.row===null
          || req.body.col===undefined || req.body.col===null
          || isNaN(req.body.maxWeight) || req.body.maxWeight<=0
          || isNaN(req.body.maxVolume) || req.body.maxVolume<=0
          || typeof req.body.positionID !== 'string'
          || typeof req.body.aisleID !== 'string'
          || typeof req.body.row !== 'string'
          || typeof req.body.col !== 'string'
          || re.test(req.body.positionID)===false
          || req.body.positionID.length!=12
          || req.body.aisleID.length!=4 
          || req.body.row.length!=4
          || req.body.col.length!=4
          || req.body.positionID!==req.body.aisleID+req.body.row+req.body.col
          || Object.keys(req.body).length===0 ) {
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
        await pos.storePosition(data);
        return res.status(201).json();
    } catch (err) {
      return res.status(503).json();
    }
  });


  //PUT /api/position/:positionID
  app.put('/api/position/:positionID', async (req, res) => {
    try {
      let re = new RegExp('^[0-9]+$');
          if ( req.params.positionID===undefined || req.params.positionID===null
            || req.body.newAisleID===undefined || req.body.newAisleID===null
            || req.body.newRow===undefined || req.body.newRow===null
            || req.body.newCol===undefined || req.body.newCol===null
            || isNaN(req.body.newMaxWeight) || req.body.newMaxWeight<=0
            || isNaN(req.body.newMaxVolume) || req.body.newMaxVolume<=0
            || isNaN(req.body.newOccupiedWeight) || req.body.newOccupiedWeight<=0
            || isNaN(req.body.newOccupiedVolume) || req.body.newOccupiedVolume<=0
            || typeof req.params.positionID !== 'string'
            || typeof req.body.newAisleID !== 'string'
            || typeof req.body.newRow !== 'string'
            || typeof req.body.newCol !== 'string'
            || req.body.newOccupiedWeight>req.body.newMaxWeight
            || req.body.newOccupiedVolume>req.body.newMaxVolume
            || re.test(req.params.positionID)===false
            || re.test(req.body.newAisleID)===false
            || re.test(req.body.newRow)===false
            || re.test(req.body.newCol)===false
            || req.params.positionID.length!=12
            || req.body.newAisleID.length!=4 
            || req.body.newRow.length!=4
            || req.body.newCol.length!=4
            || Object.keys(req.body).length===0 ) {
                return res.status(422).json();
            }
            const N = await pos.isTherePosition({ id: req.params.positionID });
            const M = await pos.isTherePosition({ id: req.body.newAisleID+req.body.newRow+req.body.newCol });
            if ( N === 1 && M === 0 ) {
                const data = {
                  positionID: req.params.positionID,
                  newAisleID: req.body.newAisleID,
                  newRow: req.body.newRow,
                  newCol: req.body.newCol,
                  newMaxWeight: req.body.newMaxWeight,
                  newMaxVolume: req.body.newMaxVolume,
                  newOccupiedWeight: req.body.newOccupiedWeight,
                  newOccupiedVolume: req.body.newOccupiedVolume,
                  newPositionID: req.body.newAisleID+req.body.newRow+req.body.newCol
                };
                await pos.modifyPosition(data);
                return res.status(200).json();
            }
            return res.status(404).json();

    } catch (err) {
      return res.status(503).json(err);
    }
  });

  //PUT /api/position/:positionID/changeID
  app.put('/api/position/:positionID/changeID', async (req, res) => {
    try {
      let re = new RegExp('^[0-9]+$');
      if ( req.params.positionID===undefined || req.params.positionID===null
        || req.body.newPositionID===undefined || req.body.newPositionID===null
        || typeof req.params.positionID !== 'string'
        || typeof req.body.newPositionID !== 'string'
        || re.test(req.params.positionID)===false
        || re.test(req.body.newPositionID)===false
        || req.params.positionID.length!=12 || req.body.newPositionID.length!=12
        || Object.keys(req.body).length === 0 ) {
        return res.status(422).json();
      }
      const N = await pos.isTherePosition({ id: req.params.positionID });
      const M = await pos.isTherePosition({ id: req.body.newPositionID });
      if (N === 1 && M === 0) {
        const data = {
          newPositionID: req.body.newPositionID,
          newAisleID: req.body.newPositionID.substr(0, 4),
          newRow: req.body.newPositionID.substr(4, 4),
          newCol: req.body.newPositionID.substr(8, 4),
          positionID: req.params.positionID
        };
        await pos.modifyPositionID(data);
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
      let re = new RegExp('^[0-9]+$');
      if ( req.params.positionID===undefined || req.params.positionID===null
          || typeof req.params.positionID !== 'string'
          || re.test(req.params.positionID)===false
          || req.params.positionID.length!=12 
          || await pos.isTherePosition({id: req.params.positionID})!=1 ) {
          return res.status(422).json();
      }

      await pos.deletePosition({ positionID: req.params.positionID });
      return res.status(204).json();

    } catch (err) {
      return res.status(503).json();
    }
  });

}
