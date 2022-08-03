## Getting Started

On the server-side, simply add this line after initializing the io engine:
```js
const io = require('socket.io')();
new MediasoupManager(io);
```