import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';

const __dirname = "D:\\WEB\\WebProj\\jukebox2.0";
const app = express();
const server = createServer(app);
const io = new Server(server);
const publicPath = path.join(__dirname, '.', 'public');  // Update this line


app.use(express.static(publicPath));  // Serve static files

app.get('/home', (req, res) => { 
    res.sendFile(path.join(publicPath, 'index.html'));
});

io.on('connection', (socket) => {
    socket.on('submit', (name) => {
        console.log(`User ${name}:connected to the server`);
        let roomIds = Array.from(socket.rooms.values());
        let userRoom = roomIds[0]; // Assuming the user is in more than one room
        script.rooms.push(userRoom);
        console.log("rooms:", script.rooms);
    });
    socket.on('loadVideo', (videoId) => {
        // Broadcast the video ID to all other clients
        socket.broadcast.emit('videoLoaded', videoId);
    });
});
io.on('connection', (socket) => {
    socket.on('submit', (name) => {
        console.log(`User ${name}:connected to the server`);
    });
    socket.on('loadVideo', (videoId) => {
        socket.broadcast.emit('videoLoaded', videoId);
    });
});
// Listen for the 'connect' event on the io instance
io.on('connect', (socket) => {
    // console.log('Connected to user');
});
server.listen(3000, () => {
    console.log('Server is running on port 3000');
});