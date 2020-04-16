import { writeFileSync } from "fs";

const config = {
  backendHost: process.env["BACKEND_HOST"] || "http://localhost:3000",
  maxTweetsToList: process.env["MAX_TWEETS_TO_LIST"] || 10
};

writeFileSync("../src/config.json", JSON.stringify(config));
