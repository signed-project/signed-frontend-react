import axios from "axios";
import { addPost } from "./addPost.js";
import { addSource } from "./addSource.js";

export const loadIndexes = ({ internalStore, sources, callback }) => {
  sources.map(async (source) => {
    const currentSourceAddress = source.address;

    if (!(currentSourceAddress in internalStore.indexesByAddress)) {
      try {
        await Promise.allSettled(
          source.hosts.map(async (host) => {
            let res = await axios.get(`${host.index}`);

            internalStore.indexesByAddress[currentSourceAddress] =
              res.data.index;

            addSource({ internalStore, source: res.data.source });

            res.data.index.recentPosts.map((post) => {
              addPost({ internalStore, post });
              return;
            });

            callback();

            return;
          })
        );
      } catch (e) {
        console.warn("[loadIndexes][Promise.allSettled]", e);
      }
    }

    return;
  });
};
