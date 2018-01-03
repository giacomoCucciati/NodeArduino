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
  router.get('/open-serial', (req, res) => {
    console.log('Requested opening Serial Port');
    maincontrol.configure();
    res.send({message: "Opening the serial port."});
  });

  // Read serial port
  router.get('/read-serial', (req, res) => {
    //console.log('Requested reading Serial Port');
    maincontrol.startReading();
    res.send({message: 'Reading Serial Port.'});
  });

  // Read serial port
  router.get('/pause-serial', (req, res) => {
    console.log('Requested pausing Serial Port');
    //maincontrol.arduino.pausereading();
    res.send({message: "Pausing"});
  });

  // Read serial port
  router.get('/resume-serial', (req, res) => {
    console.log('Requested resuming Serial Port');
    //maincontrol.arduino.resumereading();
    res.send({message: "Resuming Serial Port."});
  });

  // Close serial port
  router.get('/close-serial', (req, res) => {
    console.log('Requested closing Serial Port');
    //maincontrol.arduino.closeserial();
    res.send({message: "Closing the serial port."});
  });

  // Get data
  router.get('/data', (req, res) => {
    console.log('Requested new data');
    res.send(maincontrol.getData());
  });

  return {
    router,
  };

};
