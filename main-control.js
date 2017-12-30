const express = require('express')

module.exports = function() {

  var arduino = require('./arduino/board')();
  var values = [];
  var mysocket = undefined;

  var configure = function(socket) {

    arduino.connectserial("/dev/tty.usbmodem1411",9600);
    arduino.eventEmitter.on("new-serial-data", elaborateData);
    mysocket = socket.of("/control");
  };

  var elaborateData = function(theSerialData) {
    let singleValue = theSerialData.substring(7,theSerialData.length - 1);
    values.push(parseInt(singleValue));
    console.log("ElaborateData, last value: ", singleValue);
    mysocket.emit("new-data");
  };

  var getData = function() {
    console.log("getData called");
    return {data: values[values.length-1]};
  };

  return {
    arduino,
    configure,
    getData
  };

}
