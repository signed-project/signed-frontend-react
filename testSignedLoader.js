const sources = require("./config.json");
const {
  getStreamPage,
} = require("./src/api/customNpmPackage/signedLoader/index.js");

(async () => {
  const limit = 10;
  let currentStream = [];

  const callbackForFrontend = (stream) => {
    if (currentStream.length !== limit && stream.length > 0) {
      console.log("callbackForFrontend");
      console.log(stream.length);
      currentStream = stream;
    }
  };

  getStreamPage({
    subscribedSources: sources,
    blacklistedSourcesByAddress: {},
    afterPost: {},
    limit,
    callback: callbackForFrontend,
  });

  // await new Promise((resolve) => setTimeout(resolve, 15000));
})();
// (async () => await new Promise(resolve => setTimeout(resolve, 15000)))();
