export const loadIndexes = ({ internalStore, sources, callback }) => {
  if (!internalStore.indexesByAddress[sources.hosts[0].index]) {
    // await axios.get(sources.hosts[0].index);
    // internalStore.indexesByAddress = res.data; (~)
    // callback();
  }
};
