const fs = require("fs");
const { transpile } = require("postman2openapi");
require("dotenv").config();
const axios = require("axios");

(async () => {
  const response = await axios.get(
    `${process.env.POSTMAN_API_URL}?access_key=${process.env.POSTMAN_ACCESS_KEY}`
  );
  const openapi = await transpile(response.data.collection);
  openapi.servers = [
    {
      url: `${process.env.BASE_URL}}`,
    },
  ];
  fs.writeFile(
    "./config/swagger-output.json",
    JSON.stringify(openapi, null, 2),
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("File created successfully");
      }
    }
  );
})();
