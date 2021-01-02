const express = require('express');

const cors = require('cors');
const morgan = require('morgan');

const serverless = require('serverless-http');
const app = express();

const PORT = process.env.PORT || 5000;
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

app.use('/functions', require('./Routes/Auth'));
app.use('/post_functions', require('./Routes/Post'));

app.get('/hello', (req, res) => {
  res.send('API Running');
});

module.exports.handler = serverless(app, {
  request: function (req, event, context) {
    context.callbackWaitsForEmptyEventLoop = false;
    req.event = event;
    req.context = context;
  },
});
