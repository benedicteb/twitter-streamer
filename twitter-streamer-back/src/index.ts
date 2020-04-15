import express from "express";
import Twitter from "twitter";

const TWITTER_CONSUMER_KEY = process.env["TWITTER_CONSUMER_KEY"];
const TWITTER_CONSUMER_SECRET = process.env["TWITTER_CONSUMER_SECRET"];
const TWITTER_ACCESS_TOKEN_KEY = process.env["TWITTER_ACCESS_TOKEN_KEY"];
const TWITTER_ACCESS_TOKEN_SECRET = process.env["TWITTER_ACCESS_TOKEN_SECRET"];

if (TWITTER_CONSUMER_KEY === undefined) {
  throw Error("Missing TWITTER_CONSUMER_KEY");
} else if (TWITTER_CONSUMER_SECRET === undefined) {
  throw Error("Missing TWITTER_CONSUMER_SECRET");
} else if (TWITTER_ACCESS_TOKEN_KEY === undefined) {
  throw Error("Missing TWITTER_ACCESS_TOKEN_KEY");
} else if (TWITTER_ACCESS_TOKEN_SECRET === undefined) {
  throw Error("Missing TWITTER_ACCESS_TOKEN_SECRET");
}

const twitterClient = new Twitter({
  consumer_key: TWITTER_CONSUMER_KEY,
  consumer_secret: TWITTER_CONSUMER_SECRET,
  access_token_key: TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: TWITTER_ACCESS_TOKEN_SECRET
});

twitterClient.stream("statuses/filter", { track: "javascript" }, stream => {
  stream.on("data", function(event) {
    console.log(event.text);
  });

  stream.on("error", function(error) {
    throw error;
  });
});

const app = express();
const port = 3000;

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
