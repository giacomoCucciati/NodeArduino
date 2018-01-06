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
            board.pinMode(9,board.MODES.PWM);
            board.pinMode(10,board.MODES.PWM);
            board.pinMode(11,board.MODES.PWM);
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

  var changecolor = function(r, g, b) {
    board.analogWrite(11,r);
    board.analogWrite(10,b);
    board.analogWrite(9,g);
    console.log("Value changed to: ",r, g, b);
  };

  return {
    port,
    eventEmitter,
    changecolor: changecolor,
    pausereading: pausereading,
    resumereading: resumereading,
    connectserial: connectserial,
    closeserial: closeserial,
    activatereading: activatereading
  };

}
