const internalStore = {
  // all posts includes postsById
  postsByHash: {},

  // all actual posts (post (rootPost), reply, repost, like)
  postsById: {},

  // all archives => hash: JSON.parse(hash.json)
  archivesByHash: {},

  // set actual time range
  archiveDepth: 1635675379,

  // source.hosts.index => { index }
  indexesByAddress: {},

  // source.hosts.index => { source }
  sourcesByAddress: {},
};
