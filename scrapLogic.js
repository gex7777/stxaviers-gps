const puppeteer = require("puppeteer");
require("dotenv").config();
var tries = 1;
const linkDuration = 14;
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
  const context = browser.defaultBrowserContext();
  await context.overridePermissions("https://www.iopgps.com/", []);
  const page = await browser.newPage();
  console.log("scrapping started");

  try {
    page.setDefaultNavigationTimeout(0);

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

    const input = await page.$("input.ant-input-number-input");
    await input.click({ clickCount: 3 });
    await page.keyboard.press("Backspace");
    await input.type(`${linkDuration}`);

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
    myCache.set("location", { link: text[0] }, linkDuration * 3600);
  } catch (e) {
    console.error(e);
    console.log("tries " + tries);

    if (tries > 6) {
      res.send(`after ${tries}tires somthing went wrong with ${e} `);
      tries = 1;
    } else {
      tries = tries + 1;
      scrapLogic(res, myCache);
    }
  } finally {
    // Wait and click on first result

    await page.close();

    await browser.close();
  }
};
module.exports = { scrapLogic };
