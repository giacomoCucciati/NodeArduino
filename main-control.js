const express = require('express')

module.exports = function(theSocket) {

  var arduino = undefined;
  var values = [];
  var mysocket = theSocket.of("/control");;

  var configure = function(port) {
    arduino = require('./arduino/board')();
    arduino.connectserial("port",57600);
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

  var changecolor = function(r,g,b) {
    arduino.changecolor(r, g, b);
  };

  return {
    arduino,
    configure,
    getData,
    changecolor,
    startReading
  };

}
