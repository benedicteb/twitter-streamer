import React, { useEffect, useRef, useState } from "react";

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

      const updated = [tweet, ...ref.current];
      ref.current = updated;
      setTweets(updated);
    });

    // Close request when component is unmounted
    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="App">
      <h1>Tweets</h1>

      <ul>
        {tweets.map(tweet => (
          <li key={tweet.text}>
            {tweet.createdAt} - {tweet.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
