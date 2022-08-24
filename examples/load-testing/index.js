const express = require('express');
const http = require('http');

// uncomment one of the following lines to see all mediasoup's internal logging messages:
// process.env.DEBUG = "mediasoup*" // show everything mediasoup related
process.env.DEBUG = "mediasoup:WARN:* mediasoup:ERROR:*" // show only mediasoup warnings & errors

const SimpleMediasoupPeerServer = require("simple-mediasoup-peer-server");
const io = require('socket.io')()



const app = express()
const server = http.createServer(app)

io.listen(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true,
    },
})

// serve the client-side files
const distFolder = process.cwd() + '/public'
console.log('Serving static files at ', distFolder)
app.use(express.static(process.cwd() + '/public'))

const port = 5000;
server.listen(port)
console.log(`Server listening on http://localhost:${port}`);

// keep track of all clients here
let clients = {};

function setupSocketServer() {
    io.on('connection', (socket) => {
        console.log('User ' + socket.id + ' connected, there are ' + io.engine.clientsCount + ' clients connected')
        
        socket.emit('clients', Object.keys(clients));
        socket.broadcast.emit('clientConnected', socket.id);
        
        // then add to our clients object
        clients[socket.id] = {}; // store initial client state here
        
        socket.on('disconnect', () => {
            delete clients[socket.id];
            io.sockets.emit('clientDisconnected', socket.id);
            console.log('client disconnected: ', socket.id);
        })
    });
}


function main() {
    // the mediasoup manager object will set up additional event 
    // handlers on the socket-io object
    new SimpleMediasoupPeerServer(io); 
    setupSocketServer();
}

main();
