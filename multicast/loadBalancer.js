const http = require("http");

const dgram = require("dgram");
const client = dgram.createSocket("udp4");
const PORT = 5007;

const servers = [];

const requestListener = async function (req, res) {
  res.setHeader("Content-Type", "application/json");

  if (servers.length < 1) {
    res.writeHead(500);
    res.end(`No servers available`);
  } else {
    const selected = Math.floor(Math.random() * servers.length);
    const server = servers[selected];

    res.writeHead(200);
    res.end(`${server.address}:${server.port}`);
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
  const string = "Message Received";
  const response = Buffer.alloc(string.length, string);
  client.send(response, 0, response.length, remote.port, remote.address);
  console.log(`UDP: From: ${remote.address}:${remote.port}`);
  servers.push({
    address: parsedMessage.host,
    port: parsedMessage.port,
  });
});

client.bind(PORT);
