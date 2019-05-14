var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var express = require('express')



// const express = require('express')
// const app = express()
// const https = require('https')
// const fs = require('fs')
// const port = 3000

// app.get('/', (req, res) => {
//   res.send('WORKING!')
// })

// const httpsOptions = {
//   key: fs.readFileSync('./key.pem'),
//   cert: fs.readFileSync('./cert.pem')
// }
// const server = https.createServer(httpsOptions, app).listen(port, () => {
//   console.log('server running at ' + port)
// })


var https = require('https');
var fs = require('fs');
var express = require('express');

var options = {
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem'),
    requestCert: false,
    rejectUnauthorized: false
};


var app = express();

var server = https.createServer(options, app).listen(3000, function(){
    console.log("server started at port 3000");
});


//var chroma = require('chroma')
// app.use express.static(__dirname + '/app/js')
app.use(express.static('public'))
   app.get('/', function(req, res){ res.sendFile(__dirname + '/modes-spectralpool-fullworking2daarp3.html');
  //  app.get('/', function(req, res){ res.sendFile(__dirname + '/aprindex.html');
// app.get('/', function(req, res){ res.sendFile(__dirname + '/modepointer-workinglinearspecv1.html');
 
});

io.on('connection', function(socket){          //when a new connection is established

  socket.on('chat', function(data){            //on receiving chat messages from client
  	
    io.emit('chat', data);                     //send received messages to all clients including client who sent it
    //using io.emit() so that client who sent the data also receives it 
  });

  socket.on('pdown', function(data){            //on receiving mouse move events from clients

  	socket.broadcast.emit('pdown', data);       //send received data to all clients except the client who sent it 
    //using broadcast so that client who sent the data does not receive it
  });


  socket.on('pmove', function(data){            //on receiving mouse move events from clients

    socket.broadcast.emit('pmove', data);       //send received data to all clients except the client who sent it 
    //using broadcast so that client who sent the data does not receive it
  });


  socket.on('pup', function(data){            //on receiving mouse move events from clients

    socket.broadcast.emit('pup', data);       //send received data to all clients except the client who sent it 
    //using broadcast so that client who sent the data does not receive it
  });
});


http.listen(3000, '40.115.69.186')


// http.listen(8080, function(){
//   console.log('listening on *:8080');
// });

