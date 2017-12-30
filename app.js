const path = require('path');
const express = require('express');
var app = express();
var guiRouter = require('./gui-router')();



//var theBigRouter = require('./theBigRouter')
// const { fork } = require('child_process');
//
// const forked = fork('arduino/readport.js');
//
// forked.on('message', (msg) => {
//   console.log('Message from child', msg);
// });
//
// forked.send({ hello: 'world' });
//
// app.get('/', (req,res) =>
//     res.send('Main page of the application')
// )
//
//app.use('/theBigRouter', theBigRouter)
app.use('/gui', guiRouter.router);
app.use('/static', express.static(path.join(__dirname, 'static')))
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')))
app.use('/frontend', express.static(path.join(__dirname, 'frontend')))
var server = require('http').createServer(app);
var io = require('socket.io')(server);
guiRouter.configure(io);


server.listen(3000);
//app.listen(3000, () => console.log('Example app listening on port 3000!'))
