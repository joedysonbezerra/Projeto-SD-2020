const http = require("http");
function request(host, path, method, port = 8000) {
  const options = {
    hostname: host,
    port: port,
    path: path,
    method: method,
  };
  return new Promise(function (resolve, reject) {
    var req = http.request(options, function (res) {
      res.on("data", function (chunk) {
        resolve(chunk.toString("utf8"));
      });
    });

    req.end();
  });
}

module.exports = request;
