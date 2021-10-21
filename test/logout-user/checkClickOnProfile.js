module.exports.checkClickOnProfile = async function (page) {
  const nameTest = "Click on profile and check that the profile is shown";

  try {
    await page.evaluate(() => {
      document
        .querySelectorAll(
          "div[class*='post_post__'] > div[class*='typePost'] div[class*='imgAvatarWrapper'] > img"
        )[2]
        .click();
    });

    const isProfilePage = await page.$("div[class*='source_header']");

    if (isProfilePage) {
      console.log("TEST: %o - OK", nameTest);
    } else {
      throw new Error(`TEST: ${nameTest} - FAIL`);
    }
  } catch (err) {
    console.log("TEST: %o - FAIL", nameTest);
    throw new Error(`REASON: ${err.message}`);
  }
};
