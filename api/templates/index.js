const express = require('express');
const app = express();
const logger = require('./src/logger');

app.get('/__/status', function (req, res) {
  res.send('OK');
})

app.get('/__/ready', function (req, res) {
  res.send('OK');
})

app.get('/__/metrics', function (req, res) {
  res.send('OK');
})

app.listen(process.env.PORT || 3000, function () {
	logger.info('App started');
})
