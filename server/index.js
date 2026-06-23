import express from 'express';
import bodyParser from 'body-parser';
import { Server, Socket } from 'socket.io';

const io = new Server({
    cors: {
        origin: 'http://localhost:3000'
    }
});
const app = express();

app.use(bodyParser.json());

const emailtosocketId = new Map();
const socketIdtoEmail = new Map();


io.on('connection', (socket) => {
    console.log("New Connection", socket.id);
    socket.on("join-room", (data) => {
        const { emailId, roomId } = data;

        console.log("user email", emailId, "joined", roomId);
        emailtosocketId.set(emailId, socket.id);
        socketIdtoEmail.set(socket.id, emailId);


        socket.join(roomId);

        socket.emit('joined-room', roomId);

        socket.broadcast.to(roomId).emit("user-joined", { emailId });
    })

    socket.on("call-user", (data) => {
        const { emailId, offer } = data;
        const fromEmail = socketIdtoEmail.get(socket.id);
        const socketId = emailtosocketId.get(emailId);
        socket.to(socketId).emit('incoming-call', { from: fromEmail, offer });
    })

    socket.on("call-accept", (data) => {
        const { emailId, ans } = data;
        const socketId = emailtosocketId.get(emailId);
        socket.to(socketId).emit('call-accept', { ans });
    })
});

app.listen(8000, () => {
    console.log(`server listen to the port 8000`);
})

io.listen(8001);