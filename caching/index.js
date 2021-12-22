const http = require("http");
const randomTime = require("./helpers/randomTime");

const host = "localhost";
const port = 8000;

const books = [
  { title: "The Alchemist", author: "Paulo Coelho", year: 1988 },
  { title: "The Prophet", author: "Kahlil Gibran", year: 1923 },
  { title: "The Alchemist 2", author: "Paulo Coelho", year: 1988 },
  { title: "The Prophet 2", author: "Kahlil Gibran", year: 1923 },
];

let cache = { time: 0, value: [] };
let request = 0;

const requestListener = async function (req, res) {
  res.setHeader("Content-Type", "application/json");
  switch (req.url) {
    case "/data":
      const now = new Date().getTime();
      if (cache.value.length > 0 && cache.time + 8000 > now) {
        res.writeHead(200);
        res.end(JSON.stringify(cache.value));
      } else {
        request++;
        setTimeout(() => {
          if (request > 2) {
            cache = { time: new Date().getTime(), value: books };
            request = 0;
          }
          res.writeHead(200);
          res.end(JSON.stringify(books));
        }, randomTime(1000, 2000));
      }

      break;
  }
};
const server = http.createServer(requestListener);
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
