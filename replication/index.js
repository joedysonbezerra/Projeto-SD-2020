const http = require("http");
const request = require("./helpers/request");

const host = "localhost";
const port = 8000;

const requestListener = async function (req, res) {
  res.setHeader("Content-Type", "application/json");
  switch (req.url) {
    case "/data":
      const servers = [
        {
          host: "localhost",
          port: 8001,
          path: "/books",
        },
        {
          host: "localhost",
          port: 8002,
          path: "/books",
        },
      ];

      const selected = Math.floor(Math.random() * servers.length);
      const server = servers[selected];
      const requestPromise = request(
        server.host,
        server.path,
        "GET",
        server.port
      );
      const result = await requestPromise;

      res.writeHead(200);
      res.end(result);
      break;
  }
};
const server = http.createServer(requestListener);
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
