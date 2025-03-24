const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
    return res.send("Hello World!");
})

app.all("*", (req, res) => {
    return res.status(404).send("Not Found");
})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})