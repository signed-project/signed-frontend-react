const axios = require("axios");
const { addPost } = require("./addPost.js");
const { addSource } = require("./addSource.js");

const loadIndexes = ({
  internalStore,
  subscribedSourcesByAddress,
  callback,
}) => {
  const keysFromSubscribedSources = Object.keys(subscribedSourcesByAddress);

  keysFromSubscribedSources.map((sourceAddress) => {
    if (!(sourceAddress in internalStore.indexesByAddress)) {
      try {
        subscribedSourcesByAddress[sourceAddress].hosts.map(async (host) => {
          console.log("AXIOS HERE %s", host.index);
          let res = await axios.get(`${host.index}`).catch((e) => {
            console.log("[getIndexError] %o", e.message);
          });

          internalStore.indexesByAddress[sourceAddress] = res.data.index;

          addSource({ internalStore, source: res.data.source });

          res.data.index.recentPosts.map((post) => {
            addPost({ internalStore, post });
          });

          callback();
        });
      } catch (e) {
        console.warn("[loadIndexes][keysFromSubscribedSources.map]", e);
      }
    }
  });
};

module.exports = {
  loadIndexes,
};
