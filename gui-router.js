// Router for request from the gui page
const path = require('path')
const express = require('express');

module.exports = function(theSocket) {

  const router = express.Router();
  var maincontrol = require('./main-control')(theSocket);

  // Home page route
  router.get('/', (req, res, next) => {
      res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
  });

  // About page route
  router.get('/about', (req, res) => {
    res.send('About this wiki');
  });

  // Read serial port
  router.post('/connect-arduino', (req, res) => {
    console.log('Requested opening Serial Port on: ', req.body.port);
    res.send(maincontrol.configure(req.body.port));
  });

  // Close connection with Arduino
  router.post('/close-arduino', (req, res) => {
    console.log('Requested closing connection with Arduino.');
    maincontrol.close();
    res.send({message: "Closing connection with Arduino."});
  });

  // Read serial port
  router.get('/read-single-temp', (req, res) => {
    maincontrol.readSingleTemp();
    res.send({message: 'Reading temperature.'});
  });

  // Read serial port
  router.get('/start-cycle-temp', (req, res) => {
    console.log('Requested start reading temperature.');
    maincontrol.startTempCycle();
    res.send({message: "Start reading temperature."});
  });

  // Read serial port
  router.get('/stop-cycle-temp', (req, res) => {
    console.log('Requested stop reading temperature.');
    maincontrol.stopTempCycle();
    res.send({message: "Stop reading temperature."});
  });

  // Get data
  router.post('/data', (req, res) => {
    console.log('Requested new data type: ', req.body.load);
    res.send(maincontrol.getData(req.body.load));
  });

  // Change color
  router.post('/changecolor', (req, res) => {
    console.log('Requested new color: ',req.body.r, req.body.g, req.body.b);
    maincontrol.changecolor(req.body.r, req.body.g, req.body.b);
    res.send("Setting new color");
  });

  return {
    router,
  };

};
