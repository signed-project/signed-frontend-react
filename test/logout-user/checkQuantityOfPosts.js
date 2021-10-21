module.exports.checkQuantityOfPosts = async function (page) {
  const nameTest = "Open feed page and check if loaded > 3 posts";

  await page.waitForSelector("div[class*='postMain']");

  const posts = await page.$$("div[class*='postMain']");

  if (posts.length > 3) {
    console.log("TEST: %o - OK", nameTest);
  } else {
    throw new Error(`TEST: ${nameTest} - FAIL`);
  }
};
