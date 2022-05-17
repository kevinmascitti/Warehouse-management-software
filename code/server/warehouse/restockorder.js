'use strict';
const dayjs = require('dayjs');
const { p } = require('dayjs/dayjs.min');

module.exports = function (app, db) {
  //GET
  let orders, items;
  app.get('/api/restockOrders', async (req, res) => { //MANCA 401 UNAUTHORIZED
    try {
        orders = await getRestockOrders();
    } catch (err) {
        return res.status(500).json();
    }
    
    for (let o of orders) {
        let products = []
        ;
        try {
          items = await  getInternalOrderProducts(o.id);
          for (let i of items) {   
            let product;         
            try {
              product = await getItemInfoForInternalOrder (i.skuid, i.quantity);
              if (product == undefined) continue;
            } catch (err) {
              return res.status(500).json(err.message);
            }
            if (o.state == "COMPLETED"){
              products.push({
                SKUId: product.SKUId,
                description: product.description,
                price: product.price,
                RFID: i.rfid
              })
            }
            else products.push(product);

          }
        } catch (err) {
          return res.status(500).json(err.message);
        }
        o.products = products;
    }
    return res.status(200).json(orders);
  });


  
  app.get('/api/restockOrders/:id', async (req, res) => { //MANCA 401 UNAUTHORIZED
    if (isNaN(req.params.id)) {
      return res.status(422).json();
    }
    try {
        orders = await getInternalOrderWithID(req.params.id);
    } catch (err) {
        return res.status(503).json();
    }
    if (orders.length == 0) return res.status(404).json();

    let o = orders[0];
    try {
      items = await  getInternalOrderProducts(o.id);
      for (let i of items) {   
        let product;         
        try {
          product = await getItemInfoForInternalOrder(i.skuid, i.quantity);
          if (product == undefined) continue;
        } catch (err) {
          return res.status(500).json(err.message);
        }
        if (o.state == "COMPLETED"){
          o.products.push({
            SKUId: product.SKUId,
            description: product.description,
            price: product.price,
            RFID: i.rfid
          })
        }
        else o.products.push(product);

      }
    } catch (err) {
      return res.status(500).json(err.message);
    }
    return res.status(200).json(o);
  });

  //POST
  app.post('/api/restockorders', async (req, res) => { //MANCA 401 UNAUTHORIZED
    try {
      if ( !dayjs(req.body.issueDate).isValid() || ! Array.isArray(req.body.products) || isNaN(req.body.supplierId)) {
        return res.status(422).json(err);
      }
      //create proper ID for table insertion
      let orders = await getRestockOrders();
      let restockOrderID = 0;
      for (let o of orders) {
        if (o.id >= restockOrderID) restockOrderID = o.id + 1; 
      }
      console.log(orders + " " + restockOrderID)
      //RESTOCKORDER insertion
      const data = {
        id: restockOrderID,
        issueDate: req.body.issueDate,
        state: "ISSUED",
        products: req.body.products,
        supplierId: req.body.supplierId
      };
      await storeRestockOrder(data);

      //INTERNALORDERPRODUCT insertion
      for (let p of req.body.products) {
        await storeInternalOrderProduct({id: restockOrderID, skuid: p.SKUId, quantity: p.qty, rfid: null});
        if (await getItemInfoForInternalOrder(p.SKUId, 0) == undefined) await storeSKU({id: p.SKUId, description: p.description, price: p.price});
      }
      return res.status(201).json();
    } catch (err) {
      if (res.statusCode != 422) res.status(500).json(err.message);
      else return res.status(422).json();
    }
  });

//PUT 
app.put('/api/internrestoc/:id', async (req, res) => { //MANCA 401 UNAUTHORIZED
  try {
    if (isNaN(req.params.id) && !(req.body.newState == "ISSUED" || req.body.newState =="ACCEPTED" || req.body.newState == "REFUSED" || req.body.newState == "CANCELED" || (req.body.newState == "COMPETED" && Array.isArray(req.body.products)))) {
      return res.status(422).json();
    }
    const order = await getInternalOrderWithID(req.params.id);
    console.log(order)
    if (order.length == 0) return res.status(404).json();

    await updateStateInternalOrder(req.params.id, req.body.newState);

    if ( req.body.newState == "COMPLETED") {
      for(let product of req.body.products) {
        await updateInternalOrderProduct(product.SkuID, req.params.id, product.RFID);
      }
    }
    storeInternalOrderProduct
    return res.status(200).json();
  } catch (err) {
    return res.status(503).json(err.message);
  }
});


  //DELETE
  app.delete('/api/restockorders/:id', async (req, res) => { //MANCA 401 UNAUTHORIZED
    try {
      if (isNaN(req.params.id)) {
        return res.status(422).json();
      }
      await deleteInternalOrder(req.params.id);
      await deleteInternalOrderProducts(req.params.id);
      return res.status(204).json();
    } catch (err) {
      return res.status(503).json();
    }
  });  



















  const getRestockOrders = async function () {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM RESTOCKORDER';
      db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        const orders = rows.map((r) => (
            {
                id: r.ID,
                issueDate: r.ISSUEDATE,
                state: r.STATE,
                products: [],
                supplierId: r.supplierId
            }

        ))
        resolve(orders);
      });
    });
  }

  const getInternalOrdersWithState = async function (state) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM RESTOCKORDER WHERE STATE = ?';
      db.all(sql, state, (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        const orders = rows.map((r) => (
            {
                sku: r.ID,
                issueDate: r.ISSUEDATE,
                state: r.STATE,
                products: [],
                supplierId: r.supplierId
            }

        ))
        resolve(orders);
      });
    });
  }

  const getInternalOrderWithID = async function (id) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM RESTOCKORDER WHERE ID = ?';
      db.all(sql, [id], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        const orders = rows.map((r) => (
            {
                sku: r.ID,
                issueDate: r.ISSUEDATE,
                state: r.STATE,
                products: [],
                supplierId: r.supplierId
            }

        ))
        resolve(orders);
      });
    });
  }

  const getInternalOrderProducts = async function (restockOrderID) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM RESTOCKORDERPRODUCT WHERE RESTOCKORDERID = ?';
      db.all(sql, [restockOrderID], (err, rows) => {
        if (err) {
            reject(err);
            return;
        }
        resolve(rows.map((r) => (
          {
            skuid : r.SKUID,
            quantity : r.QUANTITY,
            rfid: r.RFID
          }
        )));
        return;
      });
    });
  }

  const getItemInfoForInternalOrder = async function (sku, quantityToReturn) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM SKU WHERE ID = ?';
      db.get(sql, [sku], (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        if (data == undefined){
          resolve(undefined);
          return;
        } 
        resolve(
          {
            SKUId: data.ID,
            description: data.DESCRIPTION,
            price: data.PRICE,
            quantity: quantityToReturn
          }
        )
      });
    });
  }
  
  function storeRestockOrder(data) {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO RESTOCKORDER(ID, ISSUEDATE, STATE, SUPPLIERID) VALUES(?, ?, ?, ?)';
      db.run(sql, [data.id, dayjs(data.issueDate).format('YYYY/MM/DD HH:mm'), data.state, data.supplierId], (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }

  function storeInternalOrderProduct(data){
     return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO INTERNALORDERPRODUCT(restockOrderID, SKUID, QUANTITY, RFID) VALUES(?, ?, ?, ?)';
      db.run(sql, [data.id, data.skuid, data.quantity, data.rfid], (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }

  function storeSKU(data){
    return new Promise((resolve, reject) => {
     const sql = 'INSERT INTO SKU(ID, DESCRIPTION, PRICE, TESTDESCRIPTORS) VALUES(?, ?, ?, ?)';
     db.run(sql, [data.id, data.description, data.price, []], (err) => {
       if (err) {
         reject(err);
         return;
       }
       resolve();
     });
   });
 }



  function updateStateInternalOrder(id, state) {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE RESTOCKORDER SET STATE = ? WHERE ID = ?';
      console.log(id, state)
      db.run(sql, [state, id], (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }

  function updateInternalOrderProduct(sku, restockOrderID, rfid) {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE INTERNALORDERPRODUCT SET RFID = ? WHERE RESTOCKORDERID = ? AND SKUID = ?';
      db.run(sql, [rfid, restockOrderID, sku], (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }

  function deleteInternalOrder(id) {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM RESTOCKORDER WHERE ID = ?';
      db.run(sql, [id], (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    })
  }

  function deleteInternalOrderProducts(restockOrderID) {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM INTERNALORDERPRODUCT WHERE restockOrderID = ?';
      db.run(sql, [restockOrderID], (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    })
  }

}