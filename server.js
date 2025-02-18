const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");
const ejs = require("ejs");
require("dotenv").config();
const PORT = process.env.PORT || 3000;
const app = express();
const BASE_URL = "https://api.mail.tm";

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
    res.render("index");
});
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
// Required for Vercel (No app.listen)
module.exports = app;
