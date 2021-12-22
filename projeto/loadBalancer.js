const http = require("http");
const request = require("./helpers/request");

const dgram = require("dgram");
const client = dgram.createSocket("udp4");
const PORT = 5007;

let servers = [];
let accessCounter = 0;

const requestListener = async function (req, res) {
  res.setHeader("Content-Type", "application/json");

  if (servers.length < 1) {
    res.writeHead(500, {
      "Access-Control-Allow-Origin": "*",
    });
    res.end(`No servers available`, "utf-8");
  } else {
    accessCounter = Math.floor((accessCounter + 1) % servers.length);
    const server = servers[accessCounter];

    res.writeHead(200, {
      "Access-Control-Allow-Origin": "*",
    });
    res.end(`${server.address}:${server.port}`, "utf-8");
  }
};

const server = http.createServer(requestListener);
server.listen(PORT, "localhost", () => {
  console.log(`Server is running on http://${"locahost"}:${PORT}`);
});

client.on("listening", () => {
  const address = client.address();
  console.log(
    "UDP Client listening on " + address.address + ":" + address.port
  );
  client.setBroadcast(true);
  client.setMulticastTTL(128);
  client.addMembership("224.1.1.1");
});

client.on("message", (message, remote) => {
  const parsedMessage = JSON.parse(message);
  const serverAlreadyAdded = servers.find(
    (server) =>
      server.address === parsedMessage.host &&
      server.port === parsedMessage.port
  );
  if (serverAlreadyAdded) return;

  const string = "Message Received";
  const response = Buffer.alloc(string.length, string);
  client.send(response, 0, response.length, remote.port, remote.address);
  console.log(`New server: ${parsedMessage.host}:${parsedMessage.port}`);
  servers.push({
    address: parsedMessage.host,
    port: parsedMessage.port,
  });
});

client.bind(PORT);

setInterval(async () => {
  servers.forEach(async ({ address, port }, index) => {
    try {
      await request(address, "/", "GET", port);
    } catch (error) {
      servers.splice(index, 1);
      console.log(`Deleted server: ${address}:${port}`);
    }
  });
}, 10 * 1000);
