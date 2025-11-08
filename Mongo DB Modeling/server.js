
const express = require("express")

app = express();

app.get("/", (req, res) => {
    try {
        res.status(200).json("hello")
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.listen(3000, () => {
    console.log("Server is running...")
})