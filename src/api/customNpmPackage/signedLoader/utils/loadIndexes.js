import axios from "axios";
import { addPost } from "./addPost.js";
import { addSource } from "./addSource.js";

export const loadIndexes = ({
  internalStore,
  subscribedSourcesByAddress,
  callback,
  userInfo,
  userStatuses,
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
            addPost({ internalStore, userInfo, userStatuses, post });
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
