require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
    res.json({ greeting: "hello API" });
});

let counter = 1;
const short_url = {};

app.get("/api/shorturl/:short_url", function (req, res) {
    const short_url_key = req.params.short_url;
    const long_url = short_url[short_url_key];
    res.redirect(long_url);
});

function isValidHttpUrl(string) {
    let url;

    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
}

app.post("/api/shorturl", (req, res) => {
    const url = req.body.url;
    if (!isValidHttpUrl(url)) {
        res.json({ error: "Invalid URL" });
        return;
    }
    res.json({
        original_url: url,
        short_url: counter,
    });
    short_url[counter] = url;
    counter++;
});

app.listen(port, function () {
    console.log(`Listening on port ${port}`);
});
