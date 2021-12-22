const dgram = require("dgram");
const fs = require("fs");
const udp = dgram.createSocket("udp4");
const randomTime = require("../helpers/randomTime");

const http = require("http");

const host = process.env.HOST || "localhost";
const port = process.env.PORT || 8000;

const requestListener = (req, res) => {
  console.log(`> new request ${req.url}`);
  res.setHeader("Content-Type", "application/json");

  setTimeout(() => {
    switch (req.url) {
      case "/authors":
        res.writeHead(200);
        res.end(fs.readFileSync("./servers/data/authors.json", "utf-8"));
        break;
      case "/books":
        res.writeHead(200);
        res.end(fs.readFileSync("./servers/data/books.json", "utf-8"));
        break;
    }
  }, randomTime(1000, 2000));
};
const tcp = http.createServer(requestListener);
tcp.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});

udp.bind(() => {
  udp.setBroadcast(true);
  udp.setMulticastTTL(128);
  sendMessage({ port, host });
  udp.on("message", (message) => {
    if (message.toString() !== "Message Received") {
      setInterval(() => sendMessage({ port, host }), 3000);
    }
  });
});

function sendMessage(object) {
  const message = Buffer.from(JSON.stringify(object));
  udp.send(message, 0, message.length, 5007, "224.1.1.1");
  console.log(`UDP - Sent: ${message} `);
}
