const express = require('express')

module.exports = function(theSocket) {

  var arduino = require('./arduino/board')();
  var values = [];
  var mysocket = theSocket.of("/control");
  var mytimer = undefined;
  var configs = require('./configs')();
  var chosenPort = undefined;

  var configure = function(port) {
    console.log("maincontrol");

    return arduino.connectserial(port,57600).then(function() {
      console.log("main control promise");

      return new Promise(function(fulfill,reject) {
        chosenPort = port;
        arduino.eventEmitter.on("new-serial-data", elaborateData);
        fulfill('OK');
      });
    });

  };

  var close = function() {
    arduino.eventEmitter.removeListener("new-serial-data", elaborateData)
    arduino.closeserial();
  };

  var elaborateData = function(theSerialData) {
    //let singleValue = theSerialData.substring(7,theSerialData.length - 1);
    var d = new Date();
    values.push({x: d.getTime(), y: parseFloat(theSerialData)});
    if(values.length > configs.temp_length) values = values.slice(-configs.temp_length);
    console.log("ElaborateData, last value: ", theSerialData);
    mysocket.emit("new-data");
  };

  var readSingleTemp = function() {
    console.log("Activating reading...");
    arduino.activatereading();
  };

  var startTempCycle = function() {
    console.log("Activating cycle reading...");
    mytimer = setInterval( function(){
      arduino.activatereading();
    }, configs.intervalReading*1000);
  };

  var stopTempCycle = function() {
    console.log("Stopping cycle reading...");
    clearInterval(mytimer);
    mytimer = undefined;
  };

  var getData = function(type) {

    if ( type === "all" ){
      return {
        message: "Updating arduino status.",
        data: values,
        ports: configs.ports,
        thePort: chosenPort,
        arduino: arduino.isConnected(),
        reading: (mytimer !== undefined)
      };
    } else if ( type === "last" ){
      return {data: values[values.length-1]};
    }
    return {data: values[values.length-1]};
  };

  var changecolor = function(r,g,b) {
    arduino.changecolor(r, g, b);
  };

  return {
    arduino,
    configure,
    close,
    getData,
    changecolor,
    readSingleTemp,
    startTempCycle,
    stopTempCycle
  };

}
