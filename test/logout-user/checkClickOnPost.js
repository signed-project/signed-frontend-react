module.exports.checkClickOnPost = async function (browser, page) {
  const nameTest = "Click on third post and check that the post is shown";
  let newTarget = null;

  browser.once("targetcreated", function (target) {
    newTarget = target;
  });

  await page.screenshot({
    path: "./click-before.png",
    type: "png",
    fullPage: true,
  });

  const posts = await page.$$(
    "div[class*='post_postMain__'] div[class*='postContent_postContent__']"
  );
  await posts[2].click();

  await page.waitForTimeout(2000);

  if (newTarget) {
    page.close();

    const newPage = await newTarget.page();

    await newPage.screenshot({
      path: "./click-after.png",
      type: "png",
      fullPage: true,
    });

    await newPage.waitForSelector("div[class*='postPage_postMain__']", {
      timeout: 5000,
    });

    const isPostPage = await newPage.$("div[class*='postPage_postMain__']");

    if (isPostPage) {
      console.log("TEST: %o - OK", nameTest);

      await newPage.screenshot({
        path: "./click-after-and-wait-for-selector.png",
        type: "png",
        fullPage: true,
      });

      return newPage;
    } else {
      throw new Error(`TEST: ${nameTest} - FAIL`);
    }
  } else {
    await page.screenshot({
      path: "./click-after.png",
      type: "png",
      fullPage: true,
    });

    await page.waitForSelector("div[class*='postPage_postMain__']", {
      timeout: 5000,
    });

    const isPostPage = await page.$("div[class*='postPage_postMain__']");

    if (isPostPage) {
      console.log("TEST: %o - OK", nameTest);

      await page.screenshot({
        path: "./click-after-and-wait-for-selector.png",
        type: "png",
        fullPage: true,
      });

      return page;
    } else {
      throw new Error(`TEST: ${nameTest} - FAIL`);
    }
  }
};
