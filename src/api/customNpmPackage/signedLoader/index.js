const internalStore = {
  // all posts includes postsById
  postsByHash: {},

  // all actual posts (post (rootPost), reply, repost, like)
  postsById: {},

  // post.target?.postHash : posts[] with the same hash as post.target.postHash
  postsByTargetHash: {},

  // posts with type such as like, repost, post but not reply
  rootPosts: [],

  // all archives => hash: JSON.parse(hash.json)
  archivesByHash: {},

  // actual time range
  archiveDepth: 0,

  // source.hosts.index => { index }
  indexesByAddress: {},

  // source.hosts.index => { source }
  sourcesByAddress: {},

  blacklistedSources: {},
};
