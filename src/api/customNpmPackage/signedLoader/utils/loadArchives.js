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
  console.log("|-- LoadArchives");
  const keysFromSubscribedSources = Object.keys(subscribedSourcesByAddress);
  const archives = [];

  console.log(
    "|-- keysFromSubscribedSources ",
    keysFromSubscribedSources.length
  );

  keysFromSubscribedSources.map((address) => {
    const currIndex = internalStore.indexesByAddress[address];

    if (currIndex && currIndex.archives.length > 0) {
      archives.push(...currIndex.archives);
    }
  });

  console.log("|-- archives ", archives.length);

  keysFromSubscribedSources.map((address) => {
    archives.map((archive) => {
      subscribedSourcesByAddress[address].hosts.map(async (host) => {
        if (
          internalStore.archiveDepth >= archive.startDate &&
          internalStore.archiveDepth <= archive.endDate &&
          !(archive.hash in internalStore.archivesByHash)
        ) {
          try {
            // FIXME: use promise or async callback
            const res = await axios.get(
              `${host.assets}/${sliceHash(archive.hash)}.json`
            );

            internalStore.archivesByHash[archive.hash] = res.data;

            console.log("archiveJSON");
            console.dir(res.data.posts.length);

            res.data.posts.map((post) => {
              addPost({ internalStore, post });
            });

            callback();
          } catch (e) {
            console.warn("[loadArchives][download JSON file]", e);
          }
        }
      });
    });
  });
};

module.exports = {
  loadArchives,
};
