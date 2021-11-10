const axios = require("axios");
const { addPost } = require("./addPost");

const sliceHash = (hash) => {
  return (
    hash.slice(0, 2) + "/" + hash.slice(2, 4) + "/" + hash.slice(4, hash.length)
  );
};

const loadArchives = ({
  internalStore,
  subscribedSourcesByAddress,
  callback,
}) => {
  const keysFromSubscribedSources = Object.keys(subscribedSourcesByAddress);
  const archives = [];

  keysFromSubscribedSources.map((address) => {
    const currIndex = internalStore.indexesByAddress[address];

    if (currIndex && currIndex.archives.length > 0) {
      archives.push(...currIndex.archives);
    }
  });

  keysFromSubscribedSources.map((address) => {
    archives.map((archive) => {
      subscribedSourcesByAddress[address].hosts.map(async (host) => {
        if (
          internalStore.archiveDepth >=
            new Date(archive.startDate).getTime() / 1000 &&
          internalStore.archiveDepth <=
            new Date(archive.endDate).getTime() / 1000
        ) {
          if (!(archive.hash in internalStore.archivesByHash)) {
            internalStore.archivesByHash[archive.hash] = true;

            try {
              const response = await axios.get(
                `${host.assets}/${sliceHash(archive.hash)}.json`
              );

              internalStore.archivesByHash[archive.hash] = response.data;

              response.data.posts.map((post) => {
                addPost({ internalStore, post });
              });

              callback();
            } catch (e) {
              console.warn("[loadArchives][download JSON file]", e);
            }
          }
        }
      });
    });
  });
};

module.exports = {
  loadArchives,
};
