const path = require('path');
const express = require('express');
var fs = require('fs');
var app = express();
var bodyParser = require('body-parser');
var https = require('https');

const opts = { key: fs.readFileSync('myOwnServer-key.pem'),
               cert: fs.readFileSync('myOwnServer-crt.pem'),
               requestCert: true,
               rejectUnauthorized: true,
               ca: [ fs.readFileSync('myOwnServer-crt.pem') ]
             }
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

var server = https.createServer(opts,app);
var io = require('socket.io')(server);
var guiRouter = require('./gui-router')(io);

app.get('/', (req, res) => {
	res.send('<a href="authenticate">Log in using client certificate</a>')
});
app.get('/authenticate', (req, res) => {
	const cert = req.connection.getPeerCertificate();
  if (req.client.authorized) {
		res.send(`Hello ${cert.subject.CN}, your certificate was issued by ${cert.issuer.CN}!`);
  } else if (cert.subject) {
		res.status(403).send(`Sorry ${cert.subject.CN}, certificates from ${cert.issuer.CN} are not welcome here.`);
  } else {
		res.status(401).send(`Sorry, but you need to provide a client certificate to continue.`);
	}
});

app.use('/gui', guiRouter.router);
app.use('/static', express.static(path.join(__dirname, 'static')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
app.use('/frontend', express.static(path.join(__dirname, 'frontend')));

server.listen(3000);
//app.listen(3000, () => console.log('Example app listening on port 3000!'))
