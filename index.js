const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const connect = require('./config/database-config');
const Chat = require('./models/chat'); // Chat model

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// SOCKET CONNECTIONS
io.on('connection', (socket) => {
    socket.on('join_room', (data) => {
        console.log("joining a room", data.roomid);
        socket.join(data.roomid);
    });

    socket.on('msg_send', async (data) => {
        console.log(data);

        // Save to database
        const chat = await Chat.create({
            roomId: data.roomid,
            user: data.username,
            content: data.msg
        });

        // Emit to clients in the same room
        io.to(data.roomid).emit('msg_rcvd', data);
    });

    socket.on('typing', (data) => {
        socket.broadcast.to(data.roomid).emit('someone_typing');
    });
});

// MIDDLEWARE & VIEW ENGINE
app.set('view engine', 'ejs');
app.use('/', express.static(__dirname + '/public'));

// ROUTES
app.get('/chat/:roomid', async (req, res) => {
    const chats = await Chat.find({
        roomId: req.params.roomid
    }).select('content user');
    
    console.log(chats);

    res.render('index', {
        name: 'Sanket',
        id: req.params.roomid,
        chats: chats
    });
});

// SERVER LISTEN
server.listen(3000, async () => {
    console.log('Server started');
    await connect();
    console.log("mongo db connected");
});
