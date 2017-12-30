const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;
const EventEmitter = require('events');
const express = require('express');

module.exports = function() {

  var port = undefined;
  var parser = undefined;
  var eventEmitter = new EventEmitter();

  var connectserial = function(newPortString,newBaudRate) {
    port = new SerialPort(
      newPortString,
      {baudRate: newBaudRate},
      function (err) {
        if (err) {
          return console.log(err.message);
        } else {
          parser = port.pipe(new Readline());
          return console.log('Success!');
        }
      }
    );
  };

  var closeserial = function() {
    port.close();
  };

  var activatereading = function() {
    // Switches the port into "flowing mode"
    parser.on('data', function (data) {
      eventEmitter.emit("new-serial-data", data.toString('utf8'));
    });
  };

  var pausereading = function() {
    port.pause();
  };

  var resumereading = function() {
    port.resume();
  };

  return {
    port,
    eventEmitter,
    pausereading: pausereading,
    resumereading: resumereading,
    connectserial: connectserial,
    closeserial: closeserial,
    activatereading: activatereading
  };

}
