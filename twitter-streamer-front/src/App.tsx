import React, { useEffect, useState } from "react";

function App() {
  const [tweets, setTweets] = useState<Tweet[]>([]);

  useEffect(() => {
    const eventSource = new EventSource("/tweets/subscribe");

    eventSource.onmessage = e => {
      console.log(e);
    };
  }, []);

  return (
    <div className="App">
      <h1>Tweets</h1>

      <ul>
        {tweets.map(tweet => (
          <li key={tweet.text}>{tweet.text}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
