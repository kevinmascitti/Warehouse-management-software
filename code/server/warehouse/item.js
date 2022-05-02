'use strict';

let items = [ //DA FARE CON SQLITE
    {
        "id":1,
        "description" : "a new item",
        "price" : 10.99,
        "SKUId" : 1,
        "supplierId" : 2
    },
    {
        "id":2,
        "description" : "another item",
        "price" : 12.99,
        "SKUId" : 2,
        "supplierId" : 1
    },
    {
        "id":3,
        "description" : "one more item",
        "price" : 2.99,
        "SKUId" : 5,
        "supplierId" : 1
    },
    {
        "id":4,
        "description" : "more more item",
        "price" : 59.99,
        "SKUId" : 7,
        "supplierId" : 3
    }
]

module.exports = function(app){

    //GET /api/items
app.get('/api/items', (req,res)=>{ //MANCA 401 UNAUTHORIZED
    return res.status(200).json(items);
  });
  
  //GET /api/items/:id
  app.get('/api/items/:id', (req,res)=>{ //MANCA 401 UNAUTHORIZED
    if(isNaN(req.params.id)){
      return res.status(422).json();
    }
    for (let item of items) {
      if(item.id == req.params.id){
        return res.status(200).json(item);
      }
    }
    return res.status(404).json();
  });
  
  //POST /api/item
  app.post('/api/item', (req,res)=>{ //MANCA 401 UNAUTHORIZED
    if(isNaN(req.body.SKUId) || isNaN(req.body.supplierId)){
      return res.status(422).json();
    }
    items.push({
      "id" : items.length + 1,
      "description" : req.body.description,
      "price" : req.body.price,
      "SKUId" : req.body.SKUId,
      "supplierId" : req.body.supplierId
    });
    return res.status(201).json();
  });
  
  //PUT /api/item/:id
  app.put('/api/item/:id', (req,res)=>{ //MANCA 401 UNAUTHORIZED
    if(isNaN(req.params.id) || isNaN(req.body.newPrice)){
      return res.status(422).json();
    }
    for (let item of items) {
      if(item.id == req.params.id){
        item.description = req.body.newDescription;
        item.price = req.body.newPrice;
        return res.status(200).json();
      }
    }
    return res.status(404).json();
  });
  
  //DELETE /api/items/:id
  app.delete('/api/items/:id', (req,res)=>{ //MANCA 401 UNAUTHORIZED
    if(isNaN(req.params.id)){
      return res.status(422).json();
    }
    items = items.filter(item => item.id != req.params.id)
    return res.status(204).json();
  });

}
