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
          internalStore.archiveDepth >= archive.startDate &&
          internalStore.archiveDepth <= archive.endDate &&
          !(archive.hash in internalStore.archivesByHash)
        ) {
          try {
            // FIXME: use promise or async callback
            const res = await axios.get(
              `${host.assets}/${sliceHash(archive.hash)}.json`
            );

            console.log("res-res-[loadArchives][res-archive.json]");
            console.dir(res);

            const archiveJSON = JSON.parse(res.data);

            internalStore.archivesByHash[archive.hash] = archiveJSON;

            archiveJSON.posts.map((post) => {
              addPost({ post });
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
