const express = require('express');
require('dotenv').config();
const cors = require('cors');

const dbConnect = require('./utils/dbConnect');

const authRoute = require('./routes/auth.route');
const couponRoute = require('./routes/coupon.route');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
    return res.status(200).json({
        status: "ok",
        message: "Server Working Properly, Welcome to the API, by Devesh Singh",
    })
})


app.use("/auth", authRoute);
app.use("/coupon", couponRoute);


app.all("*", (req, res) => {
    return res.status(404).json({
        status: "error",
        message: "Resource Not Found on Server",
    })
})


app.listen(PORT, '0.0.0.0', () => {
    console.log(`[INFO] Server is running on port ${PORT}`);
    dbConnect()
})