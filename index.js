const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    defaultViewport: false,
  });

  const page = await browser.newPage();
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
  await page.goto("https://www.iopgps.com/");

  // Set screen size

  await page.waitForNavigation();
  // Type into login
  await page.type("#username", "johnvadakkanchery@gmail.com");
  await page.type("#password", "O3664272067");
  //click login
  await page.$eval("#loginBtn", (elm) => elm.click());
  //wait while loading
  await page.waitForNavigation();
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
  // Wait and click on first result
  await page.close();
  await browser.close();
})();
