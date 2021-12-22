const http = require("http");
const request = require("./helpers/request");

const host = process.env.HOST || "localhost";
const port = process.env.PORT || 5030;

let cache = { time: 0, value: [] };
let requestCount = 0;

const requestListener = async function (req, res) {
  res.setHeader("Content-Type", "application/json");

  try {
    const now = new Date().getTime();
    if (cache.value.length > 0 && cache.time + 8000 > now) {
      console.log(`> new cache request`);
      res.writeHead(200);
      res.end(JSON.stringify(cache.value));
    } else {
      requestCount++;
      if (request > 2) {
        cache = { time: new Date().getTime(), value: books };
        requestCount = 0;
      }

      const url = await request("localhost", "/", "GET", 5007);
      const [host, port] = url.split(":");

      const response = await request(host, req.url, "GET", port);

      console.log(`> new request ${url}${req.url}`);
      res.writeHead(200);
      res.end(response);
    }
  } catch {
    res.writeHead(404);
    res.end("Error 404 - Not found");
  }
};
const server = http.createServer(requestListener);
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
