import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';

const __dirname = "D:\\WEB\\WebProj\\jukebox";
const app = express();
const server = createServer(app);
const io = new Server(server);
const publicPath = path.join(__dirname, '.', 'public');  // Update this line
var rooms=[];
let userRoom;
let roomIds;
app.use(express.static(publicPath));  // Serve static files
    
app.get('/home', (req, res) => { 
    res.sendFile(path.join(publicPath, 'home.html'));
});

io.on('connection', (socket) => {
    socket.emit("getrooms", rooms);
    socket.on('submit', (name) => {
        roomIds = Array.from(socket.rooms.values());
        userRoom = roomIds[0]; 
        rooms.push(userRoom);
        console.log(`User ${name}:connected to the server`);
        console.log("rooms:", rooms);
    });
    socket.on("joinRoom",(roomValue)=>{
        // socket.leave();
        socket.join(roomValue);
        socket.emit('executeSubmitFunc');
    });
    socket.on('videoPlay', (vid) => {
        // Broadcast the video ID to all other clients
        console.log("event emitted by:",socket.id);
        socket.broadcast.emit('videoLoaded', vid);
    socket.on('seekTime',(timeline)=>{
        socket.broadcast.emit('seek',timeline);
    });
    });
});
server.listen(3000, () => {
    console.log('Server is running on port 3000');
});