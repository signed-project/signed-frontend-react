import axios from "axios";
import { addPost } from "./addPost";

const sliceHash = (hash) => {
  return (
    hash.slice(0, 2) + "/" + hash.slice(2, 4) + "/" + hash.slice(4, hash.length)
  );
};

export const loadArchives = ({ internalStore, sources, callback }) => {
  const archivesByIndexes = [];

  for (const index in internalStore.indexesByAddress) {
    if (index.archives?.length > 0) {
      archivesByIndexes.push(...index.archives);
    }
  }

  archivesByIndexes.map((archive) => {
    sources.map((source) => {
      source.hosts.map(async (host) => {
        if (
          internalStore.archiveDepth >= archive.startDate &&
          internalStore.archiveDepth <= archive.endDate &&
          !(archive.hash in internalStore.archivesByHash)
        ) {
          try {
            const res = await axios.get(
              `${host.assets}/${sliceHash(archive.hash)}.json`
            );

            console.log("res-res-[loadArchives][res-archive.json]");
            console.dir(res);

            const archiveJSON = await JSON.parse(res.data);

            internalStore.archivesByHash[archive.hash] = archiveJSON;

            archiveJSON.posts.map((post) => {
              addPost({ post });
              return;
            });

            callback();
          } catch (e) {
            console.warn("[loadArchives][download JSON file]", e);
          }
        }

        return;
      });

      return;
    });

    return;
  });
};
