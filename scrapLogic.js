const puppeteer = require("puppeteer");
require("dotenv").config();
const scrapLogic = async (res, myCache) => {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: false,
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });
  const page = await browser.newPage();
  console.log("scrapping statreted");
  try {
    await page.evaluateOnNewDocument(function () {
      navigator.geolocation.getCurrentPosition = function (cb) {
        setTimeout(() => {
          cb({
            coords: {
              accuracy: 21,
              altitude: null,
              altitudeAccuracy: null,
              heading: null,
              latitude: 23.129163,
              longitude: 113.264435,
              speed: null,
            },
          });
        }, 1000);
      };
    });
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36"
    );

    await page.goto("https://www.iopgps.com/", { waitUntil: "load" });

    // Set screen size
    await page.setViewport({ width: 1080, height: 1024 });
    console.log("at page");
    await page.waitForNavigation();
    // Type into login
    await page.type("#username", "johnvadakkanchery@gmail.com");
    await page.type("#password", "O3664272067");
    //click login

    console.log("logged in");
    //wait while loading

    await Promise.all([
      page.$eval("#loginBtn", (elm) => elm.click()),
      page.waitForNavigation({
        waitUntil: "networkidle0",
      }),
    ]);
    await page.$eval(".guide_item_footer > button.ant-btn-primary", (elem) =>
      elem.click()
    );
    await page.waitForSelector("#id_goome_device_label_fx");
    await page.$eval("#id_goome_device_label_fx", (elm) => elm.click());

    await page.waitForSelector(".ant-modal-body");
    await page.waitForSelector(".ant-modal-body>div>input");

    await page.type(
      "body > div:nth-child(21) > div > div.ant-modal-wrap > div > div.ant-modal-content > div.ant-modal-body > div:nth-child(3) > input",
      "mew"
    );
    await page.$eval(".ant-modal-footer > button.ant-btn-primary", (elm) =>
      elm.click()
    );
    await page.waitForSelector("div.ant-modal-body > div:nth-child(6) > input");
    const text = await page.$$eval(
      "div.ant-modal-body > div:nth-child(6) > input",
      (els) => els.map((e) => e.value)
    );
    console.log(text[0]);
    res.send(JSON.stringify({ link: text[0] }));
    myCache.set("location", { link: text[0] }, 3600);
  } catch (e) {
    console.error(e);
    res.send(`somthing went wrong with ${e}`);
  } finally {
    // Wait and click on first result

    await page.close();

    await browser.close();
  }
};
module.exports = { scrapLogic };
