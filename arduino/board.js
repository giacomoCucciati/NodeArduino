const SerialPort = require('serialport');
const EventEmitter = require('events');
const express = require('express');
const Board = require("firmata");

module.exports = function() {

  var board = undefined;
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
          console.log("Connecting to arduino...");
          board = new Board(port);
          board.on("ready", () => {
            console.log("Setting sampling interval to 5s...");
            board.setSamplingInterval(5000);
            return console.log('Success, ready to communicate with Arduino!');
          });
        }
      }
    );
  };

  var closeserial = function() {

  };

  var activatereading = function() {
    board.analogRead(0, function(value) {
        eventEmitter.emit("new-serial-data", value);
    });
  };

  var pausereading = function() {

  };

  var resumereading = function() {

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
