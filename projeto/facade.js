const http = require("http");
const request = require("./helpers/request");

const host = process.env.HOST || "localhost";
const port = process.env.PORT || 5030;

let cacheArchive = {};

function getCache(path) {
  const selected = cacheArchive[path];

  return {
    isValid: selected && selected.created_at + 60 * 1000 >= Date.now(),
    created_at: selected && selected.created_at,
    value: selected && selected.value,
  };
}

function setCache(path, value) {
  cacheArchive[path] = { created_at: Date.now(), value };
}

const requestListener = async function (req, res) {
  res.setHeader("Content-Type", "application/json");

  const cache = getCache(req.url);

  try {
    if (cache.isValid) {
      console.log(`> new request with cache`);
      res.writeHead(200, {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "max-age=60",
      });
      res.end(cache.value);
    } else {
      const url = await request("localhost", "/", "GET", 5007);
      const [host, port] = url.split(":");
      console.log(`> new request ${url}${req.url}`);

      const response = await request(host, req.url, "GET", port);

      res.writeHead(200, {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "max-age=60",
      });
      res.end(response);

      setCache(req.url, response);
    }
  } catch {
    res.writeHead(500, {
      "Access-Control-Allow-Origin": "*",
    });
    res.end("Internal Server Error");
  }
};
const server = http.createServer(requestListener);
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
