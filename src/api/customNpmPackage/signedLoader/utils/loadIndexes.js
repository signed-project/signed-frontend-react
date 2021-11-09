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
      subscribedSourcesByAddress[sourceAddress].hosts.map(async (host) => {
        try {
          let res = await axios.get(`${host.index}`);

          internalStore.indexesByAddress[sourceAddress] = res.data.index;

          addSource({ internalStore, source: res.data.source });

          res.data.index.recentPosts.map((post) => {
            addPost({ internalStore, post });
          });

          callback();
        } catch (e) {
          console.warn(
            "[loadIndexes][subscribedSourcesByAddress[sourceAddress].hosts.map]",
            e
          );
        }
      });
    }
  });
};

module.exports = {
  loadIndexes,
};
