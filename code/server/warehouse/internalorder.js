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
        ;
        try {
          items = await  getProductsOrdered(o.id);
          for (let i of items) {   
            let product;         
            try {
              product = await getItemInfoForInternalOrder (i.skuid, i.quantity);
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


  app.get('/api/internalOrdersIssued', async (req, res) => { //MANCA 401 UNAUTHORIZED
    try {
        orders = await getInternalOrdersWithState(["ISSUED"]);
    } catch (err) {
        return res.status(500).json();
    }
    
    for (let o of orders) {
        let products = [];
        try {
          items = await  getProductsOrdered(o.id);
          for (let i of items) {   
            let product;         
            try {
              product = await getItemInfoForInternalOrder (i.skuid, i.quantity);
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

  app.get('/api/internalOrdersAccepted', async (req, res) => { //MANCA 401 UNAUTHORIZED
    try {
        orders = await getInternalOrdersWithState(["ACCEPTED"]);
    } catch (err) {
        return res.status(500).json();
    }
    
    for (let o of orders) {
        let products = [];
        try {
          items = await  getProductsOrdered(o.id);
          for (let i of items) {   
            let product;         
            try {
              product = await getItemInfoForInternalOrder (i.skuid, i.quantity);
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
      items = await  getProductsOrdered(o.id);
      for (let i of items) {   
        let product;         
        try {
          product = await getItemInfoForInternalOrder(i.skuid, i.quantity);
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

      //PRODUCTORDERED insertion
      for (let p of req.body.products) {
        await storeProductOrdered({id: internalOrderId, skuid: p.SKUId, quantity: p.qty, rfid: null});
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
    console.log(order)
    if (order.length == 0) return res.status(404).json();

    await updateStateInternalOrder(req.params.id, req.body.newState);

    if ( req.body.newState == "COMPLETED") {
      for(let product of req.body.products) {
        await updateProductOrdered(product.SkuID, req.params.id, product.RFID);
      }
    }

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
      await deleteProductsOrdered(req.params.id);
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

  const getProductsOrdered = async function (internalOrderId) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM PRODUCTORDERED WHERE INTERNALORDERID = ?';
      db.all(sql, [internalOrderId], (err, rows) => {
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

  const getItemInfoForInternalOrder = async function (sku, quantity) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM SKU WHERE ID = ?';
      db.get(sql, [sku], (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(
          {
            SKUId: data.ID,
            description: data.DESCRIPTION,
            price: data.PRICE,
            quantity: quantity
          }
        )
      });
    });
  }
  
  function storeInternalOrder(data) {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO INTERNALORDER(ID, ISSUEDATE, STATE, CUSTOMERID) VALUES(?, ?, ?, ?)';
      db.run(sql, [data.id, dayjs(data.issueDate).format('YYYY/MM/DD HH:MM'), data.state, data.customerId], (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }

  function storeProductOrdered(data) {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO PRODUCTORDERED(INTERNALORDERID, SKUID, QUANTITY, RFID) VALUES(?, ?, ?, ?)';
      db.run(sql, [data.id, data.skuid, data.quantity, data.rfid], (err) => {
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

  function updateProductOrdered(sku, internalOrderId, rfid) {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE PRODUCTORDERED SET RFID = ? WHERE INTERNALORDERID = ? AND SKUID = ?';
      db.run(sql, [rfid, internalOrderId, sku], (err) => {
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

  function deleteProductsOrdered(internalOrderId) {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM PRODUCTORDERED WHERE INTERNALORDERID = ?';
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