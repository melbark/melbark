var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var express = require('express')



var https = require('https');
var fs = require('fs');

var httpsOptions = {
    key: fs.readFileSync('key.1/privatekey.pem'),
    cert: fs.readFileSync('key.1/certificate.pem')
};

// var httpsOptions = {
//    key: fs.readFileSync('key/server-key.pem'),
//    cert: fs.readFileSync('key/server-cert.pem')
// };

// var app = function (req, res) {
//     res.sendFile(__dirname + '/modes-spectralpool-fullworking2daarp6.html')
// }

// http.createServer(app).listen(3000);
//https.createServer(httpsOptions, app).listen(3000);

// /home/datasmith/Downloads/spa/modes-spectralpool-fullworking2e.html

// //var chroma = require('chroma') app.use express.static(__dirname + '/app/js')
app.use(express.static('public'))
   app.get('/', function(req, res){ res.sendFile(__dirname + '/modepointer.html')});
   app.get('/test', function(req, res){ res.sendFile(__dirname + '/midiviz.html')});
   // app.get('/', function(req, res){ res.sendFile(__dirname + '/melbark.html')});
   app.get('/spectralpoolblack', function(req, res){res.sendFile(__dirname + '/spectralpool.html')});
   app.get('/spectralpoolpink', function(req, res){res.sendFile(__dirname + '/pinkpool.html')});
   app.get('/spectralpoolred', function(req, res){res.sendFile(__dirname + '/explorer.1.html')});
   app.get('/spectralpoolpurple', function(req, res){res.sendFile(__dirname + '/midipool-ableton.html')});
   app.get('/spectralpoolmagenta', function(req, res){res.sendFile(__dirname + '/midipool-ableton.1.html')});;
   // app.get('/spectralpool2', function(req, res){res.sendFile(__dirname + '/sal10.html')});;
   // app.get('/spectralpool3', function(req, res){res.sendFile(__dirname + '/modes-spectralpool-fullworking2e.html')});;
   app.get('/midiviz', function(req, res){ res.sendFile(__dirname + '/midiviz.html')});
   app.get('/harmonisphere', function(req, res){ res.sendFile(__dirname + '/sacredinstrument.1.html')});
   app.get('/sacredinstrument', function(req, res){ res.sendFile(__dirname + '/sacredinstrument.2.html')});
   app.get('/midijson', function(req, res){ res.sendFile(__dirname + '/jsonmidi.html')});
   
//   //  app.get('/', function(req, res){ res.sendFile(__dirname + '/aprindex.html');
// // app.get('/', function(req, res){ res.sendFile(__dirname + '/modepointer-workinglinearspecv1.html');
 

// io.on('connection', function(socket){          //when a new connection is established

//   socket.on('chat', function(data){            //on receiving chat messages from client
  	
//     io.emit('chat', data);                     //send received messages to all clients including client who sent it
//     //using io.emit() so that client who sent the data also receives it 
//   });

//   socket.on('pdown', function(data){            //on receiving mouse move events from clients

//   	socket.broadcast.emit('pdown', data);       //send received data to all clients except the client who sent it 
//     //using broadcast so that client who sent the data does not receive it
//   });


//   socket.on('pmove', function(data){            //on receiving mouse move events from clients

//     socket.broadcast.emit('pmove', data);       //send received data to all clients except the client who sent it 
//     //using broadcast so that client who sent the data does not receive it
//   });


//   socket.on('pup', function(data){            //on receiving mouse move events from clients

//     socket.broadcast.emit('pup', data);       //send received data to all clients except the client who sent it 
//     //using broadcast so that client who sent the data does not receive it
//   });
// });


http.listen(80, '10.0.0.4')

// http.listen(3000)
https.createServer(httpsOptions, app).listen(443);

// http.listen(8080, function(){
//   console.log('listening on *:8080');
// });
