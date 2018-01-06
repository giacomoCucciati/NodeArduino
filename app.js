const path = require('path');
const express = require('express');
var app = express();
var bodyParser = require('body-parser');




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

app.use(bodyParser.urlencoded({
    extended: true
}));

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(bodyParser.json());

var server = require('http').createServer(app);
var io = require('socket.io')(server);
var guiRouter = require('./gui-router')(io);
app.use('/gui', guiRouter.router);
app.use('/static', express.static(path.join(__dirname, 'static')))
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')))
app.use('/frontend', express.static(path.join(__dirname, 'frontend')))

server.listen(3000);
//app.listen(3000, () => console.log('Example app listening on port 3000!'))
