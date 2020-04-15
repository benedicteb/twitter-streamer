import React, { useEffect, useRef, useState } from "react";
import Layout from "./components/Layout";

function App() {
  const initialTweets: Tweet[] = [];
  const ref = useRef(initialTweets);
  const [tweets, setTweets] = useState(initialTweets);

  useEffect(() => {
    const eventSource = new EventSource(
      "http://localhost:3000/tweets/subscribe"
    );

    eventSource.addEventListener("newTweet", (event: any) => {
      const myEvent = event as ServerSentEvent;
      const tweet = JSON.parse(myEvent.data) as Tweet;

      const updated = [tweet, ...ref.current].slice(0, 5);
      ref.current = updated;
      setTweets(updated);
    });

    // Close request when component is unmounted
    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <Layout>
      <section>
        <ul className={"tweet-list"}>
          {tweets.map(tweet => (
            <li className={"tweet-list--entry"} key={tweet.id}>
              <img
                className={"tweet-list--entry--image"}
                src={tweet.profilePictureUrl}
                alt={""}
              />

              <div className={"tweet-list--entry--main"}>
                <div className={"tweet-list--entry--header"}>
                  <p className={"tweet-list--entry--username"}>
                    {tweet.authorUsername}
                  </p>
                  <p className={"tweet-list--entry--created"}>
                    {tweet.createdAt}
                  </p>
                </div>

                <p className={"tweet-list--entry--text"}>{tweet.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
}

export default App;
