const http = require("http");
const request = require("./helpers/request");

const host = "localhost";
const port = 8000;

const requestListener = async function (req, res) {
  res.setHeader("Content-Type", "application/json");
  switch (req.url) {
    case "/books":
      const result = await request("localhost", "/books", "GET", 8001);
      res.writeHead(200);
      res.end(result);
      break;
  }
};
const server = http.createServer(requestListener);
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
