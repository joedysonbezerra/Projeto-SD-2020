const request = require("./helpers/request");

const main = async () => {
  try {
    const response = await request(
      "localhost",
      `/${process.argv[2]}`,
      "GET",
      5030
    );

    console.log(response);
  } catch {
    console.log("Page not found");
  }
};

main();
