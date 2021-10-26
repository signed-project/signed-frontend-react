const puppeteer = require("puppeteer");
const { logoutUser } = require("./logout-user/index.js");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await logoutUser(browser, page);

  await browser.close();
})();
