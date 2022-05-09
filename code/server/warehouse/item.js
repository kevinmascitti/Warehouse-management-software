'use strict';

module.exports = function (app, db) {

  function isThereItem(data) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT COUNT(*) AS N FROM ITEM WHERE ID = ?';
      db.all(sql, [data.id], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows[0].N);
      });
    });
  }

  function storeItem(data) {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO ITEM(ID, DESCRIPTION, PRICE, SKUID, SUPPLIERID) VALUES(?, ?, ?, ?, ?)';
      db.run(sql, [data.id, data.description, data.price, data.SKUId, data.supplierId], (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }

  function getStoredItem(data) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM ITEM WHERE ID = ?';
      db.all(sql, [data.id], (err, rows) => {
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

  function getStoredItems() {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM ITEM';
      db.all(sql, [], (err, rows) => {
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

  function modifyStoredItem(data) {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE ITEM SET DESCRIPTION = ?, PRICE = ? WHERE ID = ?';
      db.run(sql, [data.newDescription, data.newPrice, data.id], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }


  function deleteStoredItem(data) {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM ITEM WHERE ID = ?';
      db.run(sql, [data.id], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }


  //GET /api/items
  app.get('/api/items', async (req, res) => { //MANCA 401 UNAUTHORIZED
    try {
      const items = await getStoredItems();
      return res.status(200).json(items);
    } catch (err) {
      return res.status(500).json();
    }
  });

  //GET /api/items/:id
  app.get('/api/items/:id', async (req, res) => { //MANCA 401 UNAUTHORIZED
    try {
      if (isNaN(req.params.id)) {
        return res.status(422).json();
      }
      const N = await isThereItem({ id: req.params.id });
      if (N == 1) {
        const item = await getStoredItem({ id: req.params.id });
        return res.status(200).json(item);
      }
      return res.status(404).json();
    } catch (err) {
      return res.status(500).json();
    }
  });

  //POST /api/item
  app.post('/api/item', async (req, res) => { //MANCA 401 UNAUTHORIZED
    try {
      if (isNaN(req.body.SKUId) || isNaN(req.body.supplierId) || isNaN(req.body.id)) {
        return res.status(422).json();
      }
      const data = {
        id: req.body.id,
        description: req.body.description,
        price: req.body.price,
        SKUId: req.body.SKUId,
        supplierId: req.body.supplierId
      };
      await storeItem(data);
      return res.status(201).json();
      //return res.status(404).json();
    } catch (err) {
      return res.status(500).json();
    }
  });

  //PUT /api/item/:id
  app.put('/api/item/:id', async (req, res) => { //MANCA 401 UNAUTHORIZED
    try {
      if (isNaN(req.params.id) || isNaN(req.body.newPrice)) {
        return res.status(422).json();
      }
      const data = {
        id: req.params.id,
        newDescription: req.body.newDescription,
        newPrice: req.body.newPrice,
      };
      const N = await isThereItem({ id: req.params.id });
      if (N == 1) {
        await modifyStoredItem(data);
        return res.status(200).json();
      }
      return res.status(404).json();
    } catch (err) {
      return res.status(500).json();
    }
  });

  //DELETE /api/items/:id
  app.delete('/api/items/:id', async (req, res) => { //MANCA 401 UNAUTHORIZED
    try {
      if (isNaN(req.params.id)) {
        return res.status(422).json();
      }
      await deleteStoredItem({ id: req.params.id });
      return res.status(204).json();
    } catch (err) {
      return res.status(500).json();
    }
  });

}
