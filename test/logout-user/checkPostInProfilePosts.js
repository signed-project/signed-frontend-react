module.exports.checkPostInProfilePosts = async function (page, posts) {
  const nameTest = "Check that the post is shown in the clicked profile";

  try {
    await page.waitForSelector("div[class*='postMain']");

    const posts2 = await page.$$("div[class*='postMain']");

    const elementPostOnFeedBeforeClick = posts[2];
    const elementPostOnProfilePage = posts2[2];

    const elementPostOnFeedBeforeClick_property =
      await elementPostOnFeedBeforeClick.getProperty("outerHTML");
    const elementPostOnFeedBeforeClick_outerHTML =
      await elementPostOnFeedBeforeClick_property.jsonValue();

    const elementPostOnProfilePage_property =
      await elementPostOnProfilePage.getProperty("outerHTML");
    const elementPostOnProfilePage_outerHTML =
      await elementPostOnProfilePage_property.jsonValue();

    const equal = await page.evaluate(
      (
        elementPostOnFeedBeforeClick_outerHTML,
        elementPostOnProfilePage_outerHTML
      ) =>
        elementPostOnFeedBeforeClick_outerHTML ===
        elementPostOnProfilePage_outerHTML,
      elementPostOnFeedBeforeClick_outerHTML,
      elementPostOnProfilePage_outerHTML
    );

    if (equal) {
      console.log("TEST: %o - OK", nameTest);
    } else {
      throw new Error(`TEST: ${nameTest} - FAIL`);
    }
  } catch (err) {
    console.log("TEST: %o - FAIL", nameTest);
    throw new Error(`REASON: ${err.message}`);
  }
};
