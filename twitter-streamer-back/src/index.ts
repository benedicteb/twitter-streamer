import express from "express";
import Twitter from "twitter";
import { Column, Model, Sequelize, Table } from "sequelize-typescript";
import { v4 as uuidv4 } from "uuid";

@Table
class Tweet extends Model<Tweet> {
  @Column
  text!: string;
}

@Table
class Client extends Model<Client> {
  @Column
  clientId!: string;
}

const sequelize = new Sequelize({
  database: "some_db",
  dialect: "sqlite",
  username: "root",
  password: "",
  storage: ":memory:",
  models: [Tweet, Client]
});

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

const app = express();
const port = 3000;
let openConnections: { [key: string]: express.Response } = {};

app.get("/tweets/subscribe", (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache"
  });

  // Send start of stream (the x last tweets)
  Tweet.findAll({ order: [["createdAt", "DESC"]], limit: 3 }).then(tweets => {
    tweets.reverse().forEach(tweet => {
      res.write(`${JSON.stringify(tweet.toJSON())}\n\n`);
    });
  });

  const clientId = uuidv4();

  const newClient = Client.build({ clientId });
  newClient.save();

  openConnections[clientId] = res;

  // On request close remove the client row from the db
  req.on("close", () => {
    Client.destroy({ where: { clientId } });
  });
});

const sendTweetToClient = async (tweet: Tweet): Promise<Client[]> => {
  /*
   * Loop through all client rows in the db, find the open connection
   * and write to it.
   */
  return Client.findAll().then(clients => {
    clients.forEach(client => {
      openConnections[client.clientId].write(
        `${JSON.stringify(tweet.toJSON())}\n\n`
      );
    });

    return clients;
  });
};

const pruneOpenConnections = () => {
  Object.keys(openConnections).forEach(clientId => {
    Client.findOne({ where: { clientId } }).then(client => {
      if (!client) {
        // Client has been removed from the db - remove the connection from the in-memory array
        console.log(`Removing connection ${clientId} from array`);
        delete openConnections[clientId];
      }
    });
  });

  setTimeout(pruneOpenConnections, 1000);
};

const init = async () => {
  await sequelize.sync();

  twitterClient.stream("statuses/filter", { track: "javascript" }, stream => {
    stream.on("data", function(event) {
      const newTweet = Tweet.build({ text: event.text });

      newTweet.save();
      sendTweetToClient(newTweet);
    });

    stream.on("error", function(error) {
      throw error;
    });
  });

  app.listen(port, () => console.log(`Listening at http://localhost:${port}`));

  pruneOpenConnections();
};

init();
