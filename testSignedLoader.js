const sources = require("./config.json");
const {
  getStreamPage,
} = require("./src/api/customNpmPackage/signedLoader/index.js");

let currentStream = [];

const callbackForFrontend = (stream) => {
  currentStream = stream;
  console.log("callback");
  console.dir(currentStream);
};

getStreamPage({
  subscribedSources: sources,
  blacklistedSourcesByAddress: {},
  afterPost: {},
  limit: 10,
  callback: callbackForFrontend,
});

console.log("currentStream");
console.dir(currentStream);
(async () => await new Promise(resolve => setTimeout(resolve, 15000)))();
