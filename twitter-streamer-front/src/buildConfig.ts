const fs = require("fs");

const config = {
  backendHost: process.env["BACKEND_HOST"] || "http://localhost:3000",
  maxTweetsToList: parseInt(process.env["MAX_TWEETS_TO_LIST"] || "10")
};

fs.writeFileSync("src/config.json", JSON.stringify(config));

export {};
