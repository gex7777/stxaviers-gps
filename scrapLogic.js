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

  console.log("scrapping started");
  try {
    page.setDefaultNavigationTimeout(0);
    const context = browser.defaultBrowserContext();
    await context.overridePermissions("https://www.iopgps.com/", []);

    // Set screen size

    console.log("at page");
    await Promise.all([
      page.goto("https://www.iopgps.com/", { waitUntil: "domcontentloaded" }),
      page.waitForSelector("body"),
    ]);
    // Type into login
    await page.type("#username", "johnvadakkanchery@gmail.com");
    await page.type("#password", "O3664272067");
    //click login

    console.log("logged in");
    //wait while loading

    await page.$eval("#loginBtn", (elm) => elm.click());
    await page.waitForSelector("body");
    await page.waitForSelector(".guide_item_footer > button.ant-btn-primary");
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
