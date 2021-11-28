// HTTP Server setup:
// https://stackoverflow.com/questions/27393705/how-to-resolve-a-socket-io-404-not-found-error
const express = require('express'),
    http = require('http')
const app = express()
const server = http.createServer(app)
const MediasoupManager = require("./MediasoupManager");

let io = require('socket.io')()
io.listen(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true,
    },
})

const distFolder = process.cwd() + '/client/dist'
console.log('Serving static files at ', distFolder)
app.use(express.static(process.cwd() + '/client/dist'))

const port = 5000;
server.listen(port)
console.log(`Server listening on http://localhost:${port}`);

let clients = {};

function setupSocketServer(mediasoupManager) {
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
    let mediasoupManager = new MediasoupManager(io);
    setupSocketServer();
}

main();
