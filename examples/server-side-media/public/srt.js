let socket;

async function main() {
  console.log("~~~~~~~~~~~~~~~~~");

  socket = io();
 
  socket.on("connect", () => {
    console.log("Socket ID: ", socket.id); // x8WIv7-mJelg7on_ALbx
    socket.emit("createServerSideBroadcaster");
  });

  socket.on("srtData", (data) => {
    console.log("got SRT data: ", data);
    document.getElementById(
      "info"
    ).innerHTML = `Start streaming to <a href=${data.url}>${data.url}</a>`;
  });
}

main();
