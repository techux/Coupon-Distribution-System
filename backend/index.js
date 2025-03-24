const express = require('express');
require('dotenv').config();

const dbConnect = require('./utils/dbConnect');

const authRoute = require('./routes/auth.route');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
    return res.status(200).json({
        status: "ok",
        message: "Server Working Properly, Welcome to the API, by Devesh Singh",
    })
})


app.use("/auth", authRoute);


app.all("*", (req, res) => {
    return res.status(404).json({
        status: "error",
        message: "Resource Not Found on Server",
    })
})


app.listen(PORT, () => {
    console.log(`[INFO] Server is running on port ${PORT}`);
    dbConnect()
})