module.exports.checkClickOnBackToFeed = async function (page) {
  const nameTest =
    "Click on button for come back to feed stream and check that the stream of posts is shown";

  await page.click("div[class*='backBlock'] > img", { button: "left" });

  await page.waitForSelector("div[class*='postMain']");

  const posts2 = await page.$$("div[class*='postMain']");

  if (posts2.length) {
    console.log("TEST: %o - OK", nameTest);
    return posts2;
  }

  throw new Error(`TEST: ${nameTest} - FAIL`);
};
