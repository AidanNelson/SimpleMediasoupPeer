This guide runs through how to setup your local development to contribute to this library. If you are just looking to use this library, see the documentation [here](./README.md).

## Server

To develop on the server-side [library](/server/index.js) using [npm link](https://docs.npmjs.com/cli/v8/commands/npm-link):

```bash
# enter the server side library folder
cd server
# link the local code to npm
npm link

# then, enter your project folder
cd /PATH/TO/YOUR/PROJECT/FOLDER
# and complete the link to the local copy of the server library
npm link simple-mediasoup-peer-server
```

## Client

To develop on the client-side [library](/client/index.js) (simple-mediasoup-peer-client):

```bash
# enter the client side library folder
cd client
# start the build system (parcel) and a local development server
npm run start
```

Finally, in your index.html code, you will need to load the client-side library from the local development server

```html
<script
    src="http://localhost:8080/SimpleMediasoupPeer.js"
    type="text/javascript"
></script>
```
