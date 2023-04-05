const express = require("express");
const { scrapLogic } = require("./scrapLogic");
const NodeCache = require("node-cache");
const app = express();
const PORT = process.env.PORT || 4000;
const myCache = new NodeCache();
app.get("/", (req, res) => {
  res.send("render Puppeteer server");
});
app.get("/location", (req, res) => {
  let value = myCache.get("location");

  if (value == undefined) {
    scrapLogic(res, myCache);
  } else {
    console.log("cache hit");
    res.end(JSON.stringify(value));
  }
});
app.listen(PORT, () => console.log(`hello in ${PORT}`));
