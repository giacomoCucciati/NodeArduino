// Router for request from the gui page
const path = require('path')
const express = require('express');

module.exports = function() {

  const router = express.Router();
  var maincontrol = require('./main-control')();

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
    res.send({message: "Opening the serial port."});
  });

  // Read serial port
  router.get('/read-serial', (req, res) => {
    console.log('Requested reading Serial Port');
    maincontrol.arduino.activatereading();
    res.send({message: "Here the serial message."});
  });

  // Read serial port
  router.get('/pause-serial', (req, res) => {
    console.log('Requested pausing Serial Port');
    maincontrol.arduino.pausereading();
    res.send({message: "Here the serial message."});
  });

  // Read serial port
  router.get('/resume-serial', (req, res) => {
    console.log('Requested reasuming Serial Port');
    maincontrol.arduino.resumereading();
    res.send({message: "Here the serial message."});
  });

  // Close serial port
  router.get('/close-serial', (req, res) => {
    console.log('Requested closing Serial Port');
    maincontrol.arduino.closeserial();
    res.send({message: "Closing the serial port."});
  });

  // Close serial port
  router.get('/data', (req, res) => {
    console.log('Requested new data');
    res.send(maincontrol.getData());
  });

  var configure = function(theSocket) {
    console.log("Inside configure");
    maincontrol.configure(theSocket);

  };

  return {
    configure,
    router,
  };

};
