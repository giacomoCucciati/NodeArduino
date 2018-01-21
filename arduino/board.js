const SerialPort = require('serialport');
const EventEmitter = require('events');
const express = require('express');
const Board = require("firmata");

module.exports = function() {

  var board = undefined;
  var port = undefined;
  var eventEmitter = new EventEmitter();
  var led_R = 11;
  var led_G = 10;
  var led_B = 9;

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
            board.pinMode(led_R,board.MODES.PWM);
            board.pinMode(led_G,board.MODES.PWM);
            board.pinMode(led_B,board.MODES.PWM);
            return console.log('Success, ready to communicate with Arduino!');
          });

          // Catch the string sysex from the arduino
          board.on("string", function(theString) {
            elaborateString(theString)
          });
        }
      }
    );
  };

  var closeserial = function() {
    if(board !== undefined) {
      board.close();
      board = undefined;
    }
  };

  var activatereading = function() {
    board.sysexCommand(Board.encode([0x12,0]));
  };

  var elaborateString = function(theString) {
    let value = theString.substring(12);
    eventEmitter.emit("new-serial-data", value);

  }

  var changecolor = function(r, g, b) {
    board.analogWrite(led_R,r);
    board.analogWrite(led_G,b);
    board.analogWrite(led_B,g);
  };

  return {
    port,
    eventEmitter,
    changecolor: changecolor,
    connectserial: connectserial,
    closeserial: closeserial,
    activatereading: activatereading
  };

}
