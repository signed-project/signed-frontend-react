const { checkQuantityOfPosts } = require("./checkQuantityOfPosts.js");
const { checkClickOnPost } = require("./checkClickOnPost");
const { checkClickOnBackToFeed } = require("./checkClickOnBackToFeed");
const { checkClickOnProfile } = require("./checkClickOnProfile");
const { checkPostInProfilePosts } = require("./checkPostInProfilePosts");

module.exports.logoutUser = async function (browser, page) {
  try {
    await page.goto("http://localhost:3000/");

    await checkQuantityOfPosts(page).catch((err) => {
      throw ("Error - ", err);
    });

    await page.screenshot({
      path: "./loadedPosts-first-enter.png",
      type: "png",
      fullPage: true,
    });

    const newPage = await checkClickOnPost(browser, page).catch((err) => {
      throw ("Error - ", err);
    });

    await newPage.screenshot({
      path: "./newPage.png",
      type: "png",
      fullPage: true,
    });

    const posts = await checkClickOnBackToFeed(newPage).catch((err) => {
      throw ("Error - ", err);
    });

    await newPage.screenshot({
      path: "./loadedPosts-back-from-postPage.png",
      type: "png",
      fullPage: true,
    });

    await checkClickOnProfile(newPage).catch((err) => {
      throw ("Error - ", err);
    });

    await checkPostInProfilePosts(newPage, posts).catch((err) => {
      throw ("Error - ", err);
    });

    await newPage.screenshot({
      path: "./loadedPosts-Profile.png",
      type: "png",
      fullPage: true,
    });
  } catch (err) {
    console.error("Happened something wrong \n %o", err.message);
  }
};
