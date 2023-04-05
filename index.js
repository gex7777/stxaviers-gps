const express = require("express");
const { scrapLogic } = require("./scrapLogic");
const app = express();
const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("render Puppeteer server");
});
app.get("/location", (req, res) => {
  scrapLogic(res);
});
app.listen(PORT, () => console.log(`hello in ${PORT}`));
