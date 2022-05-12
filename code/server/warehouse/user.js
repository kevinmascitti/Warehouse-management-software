'use strict';

module.exports = function (app, db) {

  let username = "";
  let name = "";
  let surname = "";
  let type = "";
  let logged = 0;

  function isLoggedUser() {
    if(logged==1)
      return 1;
    return 0;
  }

  function storeUser(data) {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO USER(USERNAME, NAME, SURNAME, PASSWORD, TYPE) VALUES(?, ?, ?, ?, ?, ?)';
      db.run(sql, [data.username, data.name, data.surname, data.password, data.type], (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }

  function getStoredUser(data) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM USER WHERE USERNAME = ? AND TYPE = ?';
      db.all(sql, [data.username, data.type], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        else if (rows===undefined){
          resolve(false);
        } else {
            const user = rows.map((r) => (
            {
              id: r.ID,
              username: r.USERNAME,
              name: r.NAME,
              surname: r.SURNAME,
              type: r.TYPE
            }
            ));
            resolve(user);
        }
      });
    });
  }

  function getLoginInfo(data) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM USER WHERE USERNAME = ? AND PASSWORD = ?';
      db.all(sql, [data.username, data.password], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        else if (rows===undefined){
          resolve(false);
        }
        else{
          const user = rows.map((r) => (
            {
              id: r.ID,
              username: r.USERNAME,
              name: r.NAME,
              surname: r.SURNAME,
              type: r.TYPE
            }
          ));
          resolve(user);
        }
      });
    });
  }

  function getStoredSuppliers() {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM USER WHERE TYPE = "supplier" ';
      db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        else if (rows===undefined){
          resolve(false);
        }
        else {
          const users = rows.map((r) => (
            {
              id: r.ID,
              name: r.NAME,
              surname: r.SURNAME,
              email: r.USERNAME
            }
          ));
          resolve(users);
        }
      });
    });
  }

  function getStoredUsers() {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM USER WHERE TYPE != "manager" ';
      db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        else if (rows===undefined){
          resolve(false);
        }
        else {
          const users = rows.map((r) => (
            {
              id: r.ID,
              name: r.NAME,
              surname: r.SURNAME,
              email: r.USERNAME,
              type: r.TYPE
            }
          ));
        resolve(users);
        }
      });
    });
  }

  function modifyRightsStoredUser(data) {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE USER SET TYPE = ? WHERE USERNAME = ?';
      db.run(sql, [data.newType, data.username], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        else if (rows===undefined){
          resolve(false);
        }
        else {
         resolve();
        }
      });
    });
  }

  function deleteStoredUser(data) {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM USER WHERE USERNAME = ? AND TYPE = ?';
      db.run(sql, [data.username, data.type], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
         else if (rows===undefined){
          resolve(false);
        }
        else {
         resolve();
        }
      });
    });
  }

  
  //GET /api/userinfo
  app.get('/api/userinfo', async (req, res) => {
    try {
        const data = {
          username: this.username,
          type: this.type
        }
        const user = await getStoredUser(data);
        return res.status(200).json(user);
    } catch (err) {
      return res.status(500).json();
    }
  });

  //GET /api/suppliers
  app.get('/api/suppliers', async (req, res) => {
    try {
        const suppliers = await getStoredSuppliers();
        return res.status(200).json(suppliers);
    } catch (err) {
      return res.status(500).json();
    }
  });

  //GET /api/users
  app.get('/api/users', async (req, res) => {
    try {
        const users = await getStoredUsers();
        return res.status(200).json(users);
    } catch (err) {
      return res.status(500).json();
    }
  });

  //POST /api/newUser
  app.post('/api/newUser', async (req, res) => {
    try {
        const dataCheck = {
          username: req.body.username,
          type: req.body.type
        };
        const user = getStoredUser(dataCheck);
        if ( user==null ) {
          return res.status(409).json();
        }

        if ( isNaN(req.body.username) || isNaN(req.body.name)
          || isNaN(req.body.surname) || isNaN(req.body.password)
          || isNaN(req.body.type) || Object.keys(req.body.password).length<8 || Object.keys(req.body).length === 0
          || (req.body.type!="customer" && req.body.type!="qualityEmployee" 
          && req.body.type!="clerk" && req.body.type!="deliveryEmployee" && req.body.type!="supplier") ) {
          return res.status(422).json();
        }

        const data = {
          username: req.body.username,
          name: req.body.name,
          surname: req.body.surname,
          password: req.body.password,
          type: req.body.type
        };
        await storeUser(data);
        return res.status(201).json();
    } catch (err) {
      return res.status(503).json();
    }
  });


  //POST /api/managerSessions
  app.post('/api/managerSessions', async (req, res) => {
    try {
      const data = {
        username: req.body.username,
        password: req.body.password
      };
      const user = await getLoginInfo(data);
      if (user!=null) {
        this.username=user.username;
        this.name=user.name;
        this.surname=user.surname;
        this.type=user.type;
        this.logged=1;

        const info = {
          id: user.id,
          username: user.username,
          name: user.name
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
      const data = {
        username: req.body.username,
        password: req.body.password
      };
      const user = await getLoginInfo(data);
      if (user!=null) {
        this.username=user.username;
        this.name=user.name;
        this.surname=user.surname;
        this.type=user.type;
        this.logged=1;

        const info = {
          id: user.id,
          username: user.username,
          name: user.name
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
      const data = {
        username: req.body.username,
        password: req.body.password
      };
      const user = await getLoginInfo(data);
      if (user!=null) {
        this.username=user.username;
        this.name=user.name;
        this.surname=user.surname;
        this.type=user.type;
        this.logged=1;

        const info = {
          id: user.id,
          username: user.username,
          name: user.name
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
      const data = {
        username: req.body.username,
        password: req.body.password
      };
      const user = await getLoginInfo(data);
      if (user!=null) {
        this.username=user.username;
        this.name=user.name;
        this.surname=user.surname;
        this.type=user.type;
        this.logged=1;

        const info = {
          id: user.id,
          username: user.username,
          name: user.name
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
      const data = {
        username: req.body.username,
        password: req.body.password
      };
      const user = await getLoginInfo(data);
      if (user!=null) {
        this.username=user.username;
        this.name=user.name;
        this.surname=user.surname;
        this.type=user.type;
        this.logged=1;

        const info = {
          id: user.id,
          username: user.username,
          name: user.name
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
      const data = {
        username: req.body.username,
        password: req.body.password
      };
      const user = await getLoginInfo(data);
      if (user!=null) {
        this.username=user.username;
        this.name=user.name;
        this.surname=user.surname;
        this.type=user.type;
        this.logged=1;

        const info = {
          id: user.id,
          username: user.username,
          name: user.name
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
      this.username="";
      this.name="";
      this.surname="";
      this.type="";
      this.logged=0;
      return res.status(200).json(resBody);
    } catch (err) {
      return res.status(500).json();
    }
  });

  //PUT /api/users/:username
  app.put('/api/users/:username', async (req, res) => {
    try {
              const user = await getStoredUser(req.params.username);
              if ( user==null || user.TYPE!=req.body.oldType ) {
                return res.status(404).json();
              }

              if ( isNaN(req.params.username) 
                  || isNaN(req.body.oldType) 
                  || isNaN(req.body.newType)
                  || req.body.oldType=='manager'
                  || req.body.newType=='manager'
                  || Object.keys(req.body).length === 0
                  || (req.body.oldType!="customer" && req.body.oldType!="qualityEmployee" 
                      && req.body.oldType!="clerk" && req.body.oldType!="deliveryEmployee" && req.body.oldType!="supplier")
                  || (req.body.newType!="customer" && req.body.newType!="qualityEmployee" 
                      && req.body.newType!="clerk" && req.body.newType!="deliveryEmployee" && req.body.newType!="supplier") ) {
                return res.status(422).json();
              }

              const data = {
                username: req.params.username,
                newType: req.body.newType
              };
              await modifyRightsStoredUser(data);
              return res.status(200).json();
    } catch (err) {
      return res.status(503).json();
    }
  });

  //DELETE /api/users/:username/:type
  app.delete('/api/users/:username/:type', async (req, res) => {
    try {
              if ( isNaN(req.params.username) 
                  || isNaN(req.params.type) 
                  || req.params.type=='manager' 
                  || Object.keys(req.body).length === 0 
                  || (req.body.type!="customer" && req.body.type!="qualityEmployee"
                    && req.body.type!="clerk" && req.body.type!="deliveryEmployee" && req.body.type!="supplier") ) {
                return res.status(422).json();
              }

              const data = {
                username: req.params.username,
                type: req.params.type
              };
              await deleteStoredUser(data);
              return res.status(204).json();
    } catch (err) {
      return res.status(503).json();
    }
  });

}
