const express = require('express')

module.exports = function(theSocket) {

  var arduino = undefined;
  var values = [];
  var mysocket = theSocket.of("/control");
  var mytimer = undefined;
  var configs = require('./configs')()

  var configure = function(port) {
    arduino = require('./arduino/board')();
    arduino.connectserial(port,57600);
    arduino.eventEmitter.on("new-serial-data", elaborateData);
    let connected= false;
    if( arduino !== undefined ) connected = true;
    return { message: "Opening the serial port.", arduino: connected}
  };

  var close = function() {
    arduino.closeserial();
  };

  var elaborateData = function(theSerialData) {
    //let singleValue = theSerialData.substring(7,theSerialData.length - 1);
    var d = new Date();
    values.push({x: d.getTime(), y: parseFloat(theSerialData)});
    console.log("ElaborateData, last value: ", theSerialData);
    mysocket.emit("new-data");
  };

  var readSingleTemp = function() {
    console.log("Activating reading...");
    arduino.activatereading();
    //return {data: values[values.length-1]};
  };

  var startTempCycle = function() {
    console.log("Activating cycle reading...");
    this.mytimer = setInterval( function(){
      arduino.activatereading();
    }, configs.intervalReading*1000);
  };

  var stopTempCycle = function() {
    console.log("Stopping cycle reading...");
    clearInterval(this.mytimer);
  };

  var getData = function(type) {

    if ( type === "all" ){
      let connected = false;
      if( arduino !== undefined ) connected = true;

      return {
        data: values,
        ports: configs.ports,
        arduino: connected
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
