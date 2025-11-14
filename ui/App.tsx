import React, { useState } from "react";
import client from "./client/api";

function App() {
  const [searchQ, setSearchQ] = useState("");
  const [results, setSearchRes] = useState<Array<Record<string, any>>>([]);

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQ(event.target.value);
  };

  return (
    <>
      <h1>TEST</h1>
      <div className="card">
        <input value={searchQ} onChange={onInputChange} />
        <button
          onClick={() => {
            client.vibe
              .$get({ query: { q: encodeURIComponent(searchQ) } })
              .then(
                (res) =>
                  res.json() as Promise<{ movies: Array<Record<string, any>> }>
              )
              .then((data) => setSearchRes(data.movies));
          }}
          aria-label="get name"
        >
          Search
        </button>
        {results.map((v) => (
          <p key={v.id}>
            Title: {v.title} Genre: {v.genre}{" "}
          </p>
        ))}
      </div>
    </>
  );
}

export default App;
