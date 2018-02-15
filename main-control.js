const express = require('express')

module.exports = function(theSocket) {

  var arduino = require('./arduino/board')();
  var temperatureValues = [];
  var luminosityValues = [];
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
    var d = new Date();
    for (var property in theSerialData) {
      if (theSerialData.hasOwnProperty(property)) {
          if(property === "Temperature") {
            temperatureValues.push({x: d.getTime(), y: parseFloat(theSerialData[property])});
            if(temperatureValues.length > configs.temp_length) temperatureValues = temperatureValues.slice(-configs.temp_length);
          } else if(property === "Luminosity") {
            luminosityValues.push({x: d.getTime(), y: parseFloat(theSerialData[property])});
            if(luminosityValues.length > configs.temp_length) luminosityValues = luminosityValues.slice(-configs.temp_length);
          }
      }
    }
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
        temperatureData: temperatureValues,
        luminosityData: luminosityValues,
        ports: configs.ports,
        thePort: chosenPort,
        arduino: arduino.isConnected(),
        reading: (mytimer !== undefined)
      };
    } else if ( type === "last" ){
      return {
        temperatureData: temperatureValues[temperatureValues.length-1],
        luminosityData: luminosityValues[luminosityValues.length-1]
      };
    }
    return {
      temperatureData: temperatureValues[temperatureValues.length-1],
      luminosityData: luminosityValues[luminosityValues.length-1]
    };
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
