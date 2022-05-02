'use strict';
const express = require('express');
// init express
const app = new express();
const port = 3001;
const item = require('./warehouse/item')

app.use(express.json());

require('./warehouse/item')(app);

//GET /api/test
app.get('/api/hello', (req,res)=>{
  let message = {
    message: 'Hello World!'
  }
  return res.status(200).json(message);
});

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

module.exports = app;