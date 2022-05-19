'use strict';
const user = require('../warehouse/user');


module.exports = function (app) {
  
    let username = "";
    let name = "";
    let surname = "";
    let type = "";
    let logged = 0;

  //GET /api/userinfo
  app.get('/api/userinfo', async (req, res) => {
    try {
      if( user.isUserLogged()==1 ){
        const data = {
          username: this.username,
          type: this.type
        }
        const u = await user.getStoredUser(data);
        return res.status(200).json(u);
      }
      return res.status(404).json();
    } catch (err) {
      return res.status(500).json();
    }
  });

  //GET /api/suppliers
  app.get('/api/suppliers', async (req, res) => {
    try {
        const suppliers = await user.getStoredSuppliers();
        return res.status(200).json(suppliers);
    } catch (err) {
      return res.status(500).json();
    }
  });

  //GET /api/users
  app.get('/api/users', async (req, res) => {
    try {
        const users = await user.getStoredUsers();
        return res.status(200).json(users);
    } catch (err) {
      return res.status(500).json();
    }
  });

  //POST /api/newUser
  app.post('/api/newUser', async (req, res) => {
    try {
        if ( req.body.username===null || req.body.username===undefined
          || req.body.name===null || req.body.name===undefined
          || req.body.surname===null || req.body.surname===undefined
          || req.body.password===null || req.body.password===undefined
          || req.body.type===null || req.body.type===undefined
          || typeof req.body.username !== 'string'
          || typeof req.body.name !== 'string'
          || typeof req.body.surname !== 'string'
          || typeof req.body.password !== 'string'
          || typeof req.body.type !== 'string'
          || !req.body.username.match("^[\w]+@[\w]+\.[\w]+$")
          || req.body.password.length<8 || Object.keys(req.body).length === 0
          || (req.body.type!="customer" && req.body.type!="qualityEmployee" 
          && req.body.type!="clerk" && req.body.type!="deliveryEmployee" && req.body.type!="supplier") ) {
          return res.status(422).json();
        }

        const data = {
          username: req.body.username,
          type: req.body.type
        };
        const N = await user.isThereUser(data);
        if ( N === 1 ) {
          return res.status(409).json();
        }
        const ID = await user.getMaxID();
        console.log(ID)
        const store = {
          id: ID+1,
          username: req.body.username,
          name: req.body.name,
          surname: req.body.surname,
          password: req.body.password,
          type: req.body.type
        };
        await user.storeUser(store);
        return res.status(201).json();
    } catch (err) {
      return res.status(503).json();
    }
  });


  //POST /api/managerSessions
  app.post('/api/managerSessions', async (req, res) => {
    try {
      if( typeof req.body.username !== 'string'
       || !req.body.username.match("^[\w]+@[\w]+\.[\w]+$")
       || typeof req.body.password !== 'string' ){
          return res.status(401).json();
      }
      const data = {
        username: req.body.username,
        password: req.body.password
      };
      const N = await user.isThereUser({username: req.body.username, type: "manager"})
      if ( N === 1 ) {
        const u = await user.getLoginInfo(data);

        username=u.username;
        name=u.name;
        surname=u.surname;
        type=u.type;
        logged=1;

        const info = {
          id: u.id,
          username: u.username,
          name: u.name
        };
        return res.status(200).json(info);
      }
      return res.status(401).json();
    } catch (err) {
      return res.status(500).json();
    }
  });

  //POST /api/customerSessions
  app.post('/api/customerSessions', async (req, res) => {
    try {
      if( typeof req.body.username !== 'string'
       || !req.body.username.match("^[\w]+@[\w]+\.[\w]+$")
       || typeof req.body.password !== 'string' ){
          return res.status(401).json();
      }
      const data = {
        username: req.body.username,
        password: req.body.password
      };
      const N = await user.isThereUser({username: req.body.username, type: "customer"})
      if ( N === 1 ) {
        const u = await user.getLoginInfo(data);
        username=u.username;
        name=u.name;
        surname=u.surname;
        type=u.type;
        logged=1;

        const info = {
          id: u.id,
          username: u.username,
          name: u.name
        };
        return res.status(200).json(info);
      }
      return res.status(401).json();
    } catch (err) {
      return res.status(500).json();
    }
  });

  //POST /api/supplierSessions
  app.post('/api/supplierSessions', async (req, res) => {
    try {
      if( typeof req.body.username !== 'string'
       || !req.body.username.match("^[\w]+@[\w]+\.[\w]+$")
       || typeof req.body.password !== 'string' ){
          return res.status(401).json();
      }
      const data = {
        username: req.body.username,
        password: req.body.password
      };
      const N = await user.isThereUser({username: req.body.username, type: "supplier"})
      if ( N === 1 ) {
        const u = await user.getLoginInfo(data);
        username=u.username;
        name=u.name;
        surname=u.surname;
        type=u.type;
        logged=1;

        const info = {
          id: u.id,
          username: u.username,
          name: u.name
        };
        return res.status(200).json(info);
      }
      return res.status(401).json();
    } catch (err) {
      return res.status(500).json();
    }
  });

  //POST /api/clerkSessions
  app.post('/api/clerkSessions', async (req, res) => {
    try {
      if( typeof req.body.username !== 'string'
       || !req.body.username.match("^[\w]+@[\w]+\.[\w]+$")
       || typeof req.body.password !== 'string' ){
          return res.status(401).json();
      }
      const data = {
        username: req.body.username,
        password: req.body.password
      };
      const N = await user.isThereUser({username: req.body.username, type: "clerk"})
      if ( N === 1 ) {
        const u = await user.getLoginInfo(data);
        username=u.username;
        name=u.name;
        surname=u.surname;
        type=u.type;
        logged=1;

        const info = {
          id: u.id,
          username: u.username,
          name: u.name
        };
        return res.status(200).json(info);
      }
      return res.status(401).json();
    } catch (err) {
      return res.status(500).json();
    }
  });

  //POST /api/qualityEmployeeSessions
  app.post('/api/qualityEmployeeSessions', async (req, res) => {
    try {
      if( typeof req.body.username !== 'string'
       || !req.body.username.match("^[\w]+@[\w]+\.[\w]+$")
       || typeof req.body.password !== 'string' ){
          return res.status(401).json();
      }
      const data = {
        username: req.body.username,
        password: req.body.password
      };
      const N = await user.isThereUser({username: req.body.username, type: "qualityEmployee"})
      if ( N === 1 ) {
        const u = await user.getLoginInfo(data);
        username=u.username;
        name=u.name;
        surname=u.surname;
        type=u.type;
        logged=1;

        const info = {
          id: u.id,
          username: u.username,
          name: u.name
        };
        return res.status(200).json(info);
      }
      return res.status(401).json();
    } catch (err) {
      return res.status(500).json();
    }
  });

  //POST /api/deliveryEmployeeSessions
  app.post('/api/deliveryEmployeeSessions', async (req, res) => {
    try {
      if( typeof req.body.username !== 'string'
       || !req.body.username.match("^[\w]+@[\w]+\.[\w]+$")
       || typeof req.body.password !== 'string' ){
          return res.status(401).json();
      }
      const data = {
        username: req.body.username,
        password: req.body.password
      };
      const N = await user.isThereUser({username: req.body.username, type: "deliveryEmployee"})
      if ( N === 1 ) {
        const u = await user.getLoginInfo(data);
        username=u.username;
        name=u.name;
        surname=u.surname;
        type=u.type;
        logged=1;

        const info = {
          id: u.id,
          username: u.username,
          name: u.name
        };
        return res.status(200).json(info);
      }
      return res.status(401).json();
    } catch (err) {
      return res.status(500).json();
    }
  });

  //POST /api/logout
  app.post('/api/logout', async (req, res) => {
    try {
      username="";
      name="";
      surname="";
      type="";
      logged=0;
      return res.status(200).json();
    } catch (err) {
      return res.status(500).json();
    }
  });

  //PUT /api/users/:username
  app.put('/api/users/:username', async (req, res) => {
    try {
      if ( req.params.username===null || req.params.username===undefined
        || req.body.oldType===null || req.body.oldType===undefined
        || req.body.newType===null || req.body.newType===undefined
        || typeof req.params.username !== 'string'
        || typeof req.body.oldType !== 'string'
        || typeof req.body.newType !== 'string'
        || !req.params.username.match("^[\w]+@[\w]+\.[\w]+$")
        || req.body.oldType=="manager"
        || req.body.newType=="manager"
        || Object.keys(req.body).length === 0
        || (req.body.oldType!="customer" && req.body.oldType!="qualityEmployee" 
            && req.body.oldType!="clerk" && req.body.oldType!="deliveryEmployee" && req.body.oldType!="supplier")
        || (req.body.newType!="customer" && req.body.newType!="qualityEmployee" 
            && req.body.newType!="clerk" && req.body.newType!="deliveryEmployee" && req.body.newType!="supplier") ) {
       return res.status(422).json();
      }

      const N = await user.isThereUser({username: req.params.username, type: req.body.oldType});
      if ( N === 0 ) {
        return res.status(404).json();
      }

      const data = {
        username: req.params.username,
        newType: req.body.newType
      };
      await user.modifyRightsStoredUser(data);
      return res.status(200).json();
    } catch (err) {
      return res.status(503).json();
    }
  });

  //DELETE /api/users/:username/:type
  app.delete('/api/users/:username/:type', async (req, res) => {
    try {
      if ( req.params.username===null || req.params.username===undefined
          || req.params.type===null || req.params.type===undefined
          || typeof req.params.username !== 'string'
          || typeof req.params.type !== 'string'
          || !req.params.username.match("^[\w]+@[\w]+\.[\w]+$")
          || req.params.type=="manager"
          || Object.keys(req.params).length === 0
          || (req.params.type!="customer" && req.params.type!="qualityEmployee"
            && req.params.type!="clerk" && req.params.type!="deliveryEmployee" && req.params.type!="supplier") ) {
        return res.status(422).json();
      }

      const data = {
        username: req.params.username,
        type: req.params.type
      };
      await user.deleteStoredUser(data);
      return res.status(204).json();
    } catch (err) {
      return res.status(503).json();
    }
  });
}
