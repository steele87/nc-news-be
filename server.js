if (!process.env.NODE_ENV) process.env.NODE_ENV = 'dev';
const router =require('./router/index');
let express = require('express');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
let app = express();
let config = require('./config');
let db = process.env.DB ||config.DB[process.env.NODE_ENV];
const cors = require('cors');

mongoose.Promise = Promise;

mongoose.connect(db, {useMongoClient: true})
  .then(() => console.log('successfully connected to', db))
  .catch(err => console.log('connection failed', err));

app.use(bodyParser.json());
app.use(cors());
app.use('/api', router);
module.exports = app;
