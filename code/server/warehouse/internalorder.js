'use strict';
const dayjs = require('dayjs');
const { p } = require('dayjs/dayjs.min');

module.exports = function (app, db) {
  //GET
  let orders, items;
  app.get('/api/internalOrders', async (req, res) => { //MANCA 401 UNAUTHORIZED
    try {
        orders = await getInternalOrders();
    } catch (err) {
        return res.status(500).json();
    }
    for (let o of orders) {
        let products = []
        try {
          items = await  getInternalOrderProducts(o.id);
          for (let i of items) {   
            let product;         
            try {
              product = await getSKU (i.skuid, i.quantity);
              if (product == undefined) continue;
            } catch (err) {
              return res.status(500).json(err.message);
            }
            if (o.state == "COMPLETED"){
              let skuitems = await getSKUItems(product.SKUId, o.id);
              for (let s of skuitems) {
                products.push({
                 SKUId: product.SKUId,
                 description: product.description,
                 price: product.price,
                 RFID: s.rfid
                })
              }
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

  app.get('/api/internalOrdersIssued', async (req, res) => { //MANCA 401 UNAUTHORIZED
    try {
        orders = await getInternalOrdersWithState(["ISSUED"]);
    } catch (err) {
        return res.status(500).json();
    }
    for (let o of orders) {
        let products = []
        try {
          items = await  getInternalOrderProducts(o.id);
          for (let i of items) {   
            let product;         
            try {
              product = await getSKU (i.skuid, i.quantity);
              if (product == undefined) continue;
            } catch (err) {
              return res.status(500).json(err.message);
            }
            if (o.state == "COMPLETED"){
              let skuitems = await getSKUItems(product.SKUId, o.id);
              for (let s of skuitems) {
                products.push({
                 SKUId: product.SKUId,
                 description: product.description,
                 price: product.price,
                 RFID: s.rfid
                })
              }
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

  app.get('/api/internalOrdersAccepted', async (req, res) => { //MANCA 401 UNAUTHORIZED
    try {
        orders = await getInternalOrdersWithState(["ACCEPTED"]);
    } catch (err) {
        return res.status(500).json();
    }
    for (let o of orders) {
        let products = []
        try {
          items = await  getInternalOrderProducts(o.id);
          for (let i of items) {   
            let product;         
            try {
              product = await getSKU (i.skuid, i.quantity);
              if (product == undefined) continue;
            } catch (err) {
              return res.status(500).json(err.message);
            }
            if (o.state == "COMPLETED"){
              let skuitems = await getSKUItems(product.SKUId, o.id);
              for (let s of skuitems) {
                products.push({
                 SKUId: product.SKUId,
                 description: product.description,
                 price: product.price,
                 RFID: s.rfid
                })
              }
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


  app.get('/api/internalOrders/:id', async (req, res) => { //MANCA 401 UNAUTHORIZED
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
          product = await getSKU(i.skuid, i.quantity);
          if (product == undefined) continue;
        } catch (err) {
          return res.status(500).json(err.message);
        }
        if (o.state == "COMPLETED"){
          let skuitems = await getSKUItems(product.SKUId, o.id);
          for (let s of skuitems) {
            products.push({
            SKUId: product.SKUId,
            description: product.description,
            price: product.price,
            RFID: s.rfid
          })
            }
        }
        else o.products.push(product);

      }
    } catch (err) {
      return res.status(500).json(err.message);
    }
    return res.status(200).json(o);
  });

  //POST
  app.post('/api/internalOrders', async (req, res) => { //MANCA 401 UNAUTHORIZED
    try {
      if ( !dayjs(req.body.issueDate).isValid() || ! Array.isArray(req.body.products) || isNaN(req.body.customerId)) {
        return res.status(422).json(err);
      }
      //create proper ID for table insertion
      let orders = await getInternalOrders();
      let internalOrderId = 0;
      for (let o of orders) {
        if (o.id >= internalOrderId) internalOrderId = o.id + 1; 
      }
      //INTERNALORDER insertion
      const data = {
        id: internalOrderId,
        issueDate: req.body.issueDate,
        state: "ISSUED",
        products: req.body.products,
        customerId: req.body.customerId
      };
      await storeInternalOrder(data);

      //INTERNALORDERPRODUCT insertion
      for (let p of req.body.products) {
        await storeInternalOrderProduct({id: internalOrderId, skuid: p.SKUId, quantity: p.qty, rfid: null});
        if (await getSKU(p.SKUId, 0) == undefined) await storeSKU({id: p.SKUId, description: p.description, price: p.price});
      }
      return res.status(201).json();
    } catch (err) {
      if (res.statusCode != 422) res.status(500).json(err.message);
      else return res.status(422).json();
    }
  });

//PUT 
app.put('/api/internalOrders/:id', async (req, res) => { //MANCA 401 UNAUTHORIZED
  try {
    if (isNaN(req.params.id) && !(req.body.newState == "ISSUED" || req.body.newState =="ACCEPTED" || req.body.newState == "REFUSED" || req.body.newState == "CANCELED" || (req.body.newState == "COMPETED" && Array.isArray(req.body.products)))) {
      return res.status(422).json();
    }
    const order = await getInternalOrderWithID(req.params.id);
    if (order.length == 0) return res.status(404).json();

    await updateStateInternalOrder(req.params.id, req.body.newState);

    if ( req.body.newState == "COMPLETED") {
      for(let product of req.body.products) {
        let item = await getSKUItem(product.RFID);
        if(item != undefined) await updateInternalOrderProduct(product.SkuID, req.params.id, product.RFID);
      }
    }
    storeInternalOrderProduct
    return res.status(200).json();
  } catch (err) {
    return res.status(503).json(err.message);
  }
});


  //DELETE
  app.delete('/api/internalOrders/:id', async (req, res) => { //MANCA 401 UNAUTHORIZED
    try {
      if (isNaN(req.params.id)) {
        return res.status(422).json();
      }
      await deleteInternalOrder(req.params.id);
      await deleteInternalOrderProducts(req.params.id);
      await deleteSkuItems(req.params.id);
      return res.status(204).json();
    } catch (err) {
      return res.status(503).json();
    }
  });  



















  const getInternalOrders = async function () {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM INTERNALORDER';
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
                customerId: r.CUSTOMERID
            }

        ))
        resolve(orders);
      });
    });
  }

  const getInternalOrdersWithState = async function (state) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM INTERNALORDER WHERE STATE = ?';
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
                customerId: r.CUSTOMERID
            }

        ))
        resolve(orders);
      });
    });
  }

  const getInternalOrderWithID = async function (id) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM INTERNALORDER WHERE ID = ?';
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
                customerId: r.CUSTOMERID
            }

        ))
        resolve(orders);
      });
    });
  }

  const getInternalOrderProducts = async function (internalOrderId) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM INTERNALORDERPRODUCT WHERE INTERNALORDERID = ?';
      db.all(sql, [internalOrderId], (err, rows) => {
        if (err) {
            reject(err);
            return;
        }
        resolve(rows.map((r) => (
          {
            skuid : r.SKUID,
            quantity : r.QUANTITY,
          }
        )));
        return;
      });
    });
  }

  const getSKU = async function (sku, quantityToReturn) {
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

  const getSKUItems = async function (skuid, internalOrderId) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM SKUITEM WHERE SKUID = ? AND INTERNALORDERID = ?';
      db.all(sql, [skuid, internalOrderId], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows.map((r) => (
          {
            rfid: r.RFID,
            SKUId: r.SKUID,
            available: r.AVAILABLE,
            dateOfStock: r.DATEOFSTOCK,
            internalOrderId: r.INTERNALORDERID,
            restockOrderId: r.RESTOCKORDERID
          }))
        )
      });
    });
  }
  
  function storeInternalOrder(data) {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO INTERNALORDER(ID, ISSUEDATE, STATE, CUSTOMERID) VALUES(?, ?, ?, ?)';
      db.run(sql, [data.id, dayjs(data.issueDate).format('YYYY/MM/DD HH:mm'), data.state, data.customerId], (err) => {
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
      const sql = 'INSERT INTO INTERNALORDERPRODUCT(INTERNALORDERID, SKUID, QUANTITY) VALUES(?, ?, ?)';
      db.run(sql, [data.id, data.skuid, data.quantity], (err) => {
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
      const sql = 'UPDATE INTERNALORDER SET STATE = ? WHERE ID = ?';
      db.run(sql, [state, id], (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }

  function updateInternalOrderProduct(sku, internalOrderId, rfid) {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO SKUITEM (RFID, SKUID, AVAILABLE, DATEOFSTOCK, INTERNALORDERID) VALUES (?, ?, ?, ?, ?)';
      db.run(sql, [rfid, sku, 1, dayjs().format('YYYY/MM/DD HH:mm'), internalOrderId], (err) => {
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
      const sql = 'DELETE FROM INTERNALORDER WHERE ID = ?';
      db.run(sql, [id], (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    })
  }

  function deleteInternalOrderProducts(internalOrderId) {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM INTERNALORDERPRODUCT WHERE INTERNALORDERID = ?';
      db.run(sql, [internalOrderId], (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    })
  }
}

function getSKUItem(rfid) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM SKUITEM WHERE RFID = ?';
    db.get(sql, [rfid], (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      if (data == undefined){
        resolve(undefined);
        return;
      } 
      resolve({
        rfid: data.RFID,
        skuid: data.SKUID,
        available: data.AVAILABLE,
        dateOfStock: data.DATEOFSTOCK,
        internalOrderId: data.INTERNALORDERID,
        restockOrderId: data.RESTOCKORDERID
      });
    });
  })
}

function deleteSkuItems(internalOrderId) {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM SKUITEM WHERE INTERNALORDERID = ?';
    db.run(sql, [internalOrderId], (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  })
}
