const net = require("net");
const HOST = "localhost";
const PORT = 3001; // porta TCP LISTEN

net
  .createServer((socket) => {
    console.log(`CONNECTED: ${socket.remoteAddress}:${socket.remotePort}`);
    socket.write("Digite sua operação\n");
    socket.on("data", (data) => {
      const result = eval(data.toString("utf8"));
      socket.write(`Resultado: ${result}\n`);
    });
  })
  .listen(PORT, HOST);

console.log("Server listening on " + HOST + ":" + PORT);
