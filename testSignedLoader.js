const sources = require("./config.json");
const {
  getStreamPage,
} = require("./src/api/customNpmPackage/signedLoader/index.js");

(async () => {
  let currentStream = [];

  const callbackForFrontend = (stream) => {
    currentStream = stream;
    console.log("callback");
    console.dir(currentStream[0]);
  };

  getStreamPage({
    subscribedSources: sources,
    blacklistedSourcesByAddress: {},
    afterPost: {},
    limit: 10,
    callback: callbackForFrontend,
  });

  await new Promise((resolve) => setTimeout(resolve, 15000));
})();
// console.log("currentStream");
// console.dir(currentStream);
// (async () => await new Promise(resolve => setTimeout(resolve, 15000)))();
