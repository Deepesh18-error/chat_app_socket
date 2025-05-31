const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);  

io.on('connection' ,(socket) => {
    console.log("A User Connected" , socket.id); // every socket has a unique socket id if i do socket.id then we will get new id at every reload of web page localhost:3000

    socket.on('from_client', () => {
        console.log("event coming from client");
    })


    setInterval(() => {
        socket.emit('from_server');
    }, 2000);


});


app.use('/', express.static(__dirname + '/public')); 

server.listen(3000 , () => {
    console.log("Server started")
});