const http = require("http");
const randomTime = require("../helpers/randomTime");

const host = "localhost";
const port = 8002;

const books = JSON.stringify([
  { server: "second" },
  { title: "The Alchemist", author: "Paulo Coelho", year: 1988 },
  { title: "The Prophet", author: "Kahlil Gibran", year: 1923 },
  { title: "The Alchemist 2", author: "Paulo Coelho", year: 1988 },
  { title: "The Prophet 2", author: "Kahlil Gibran", year: 1923 },
]);

const requestListener = function (req, res) {
  res.setHeader("Content-Type", "application/json");
  switch (req.url) {
    case "/books":
      setTimeout(() => {
        res.writeHead(200);
        res.end(books);
      }, randomTime(1000, 2000));

      break;
  }
};
const server = http.createServer(requestListener);
server.listen(port, host, () => {
  console.log(`Second Server is running on http://${host}:${port}`);
});
