import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.get("/api/jokes", (req, res) => {
  try {
    const jokes = [
      {
        id: 1,
        title: "A joke",
        content: "This is a joke",
      },
      {
        id: 2,
        title: "Another joke",
        content: "This is a joke",
      },
      {
        id: 3,
        title: "Next joke",
        content: "This is a joke",
      },
      {
        id: 4,
        title: "More jokes",
        content: "This is a joke",
      },
      {
        id: 5,
        title: "Previous joke",
        content: "This is a joke",
      },
    ];
    res.status(200).json(jokes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}); // list of jokes

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
