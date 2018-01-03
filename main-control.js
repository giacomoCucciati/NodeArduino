const express = require('express')

module.exports = function(theSocket) {

  var arduino = undefined;
  var values = [];
  var mysocket = theSocket.of("/control");;

  var configure = function() {
    arduino = require('./arduino/board')();
    arduino.connectserial("/dev/tty.usbmodem1411",57600);
    arduino.eventEmitter.on("new-serial-data", elaborateData);
    //mysocket = socket.of("/control");
  };

  var elaborateData = function(theSerialData) {
    //let singleValue = theSerialData.substring(7,theSerialData.length - 1);
    values.push(parseInt(theSerialData));
    console.log("ElaborateData, last value: ", theSerialData);
    mysocket.emit("new-data");
  };

  var startReading = function() {
    console.log("Activating reading...");
    arduino.activatereading();
    return {data: values[values.length-1]};
  };

  var getData = function() {
    console.log("getData called");
    return {data: values[values.length-1]};
  };

  return {
    arduino,
    configure,
    getData,
    startReading
  };

}
