import { useState } from "react";
import "./App.css";
import axios from "axios";
import { useEffect } from "react";

function App() {
  const [jokes, setJokes] = useState([]);

  useEffect(() => {
    axios
      .get("/api/jokes")
      .then((response) => {
        setJokes(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  });

  return (
    <>
      <h1>CodeByDurvesh Full Stack App</h1>
      <h2>Number of jokes: {jokes.length}</h2> <br />
      {jokes.map((joke, key) => {
        return (
          <div key={joke.id}>
            <h3>
              {joke.title}: {joke.content}
            </h3>
          </div>
        );
      })}
    </>
  );
}

export default App;
