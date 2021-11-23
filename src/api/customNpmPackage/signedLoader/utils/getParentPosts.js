export const getParentPosts = ({ internalStore, post }) => {
  let parentPosts = [];

  if (
    post &&
    post.target &&
    Object.keys(post.target).length > 0 &&
    post.target.postHash
  ) {
    parentPosts.push(internalStore.postsByHash[post.target.postHash]);

    while (
      parentPosts[parentPosts.length - 1] &&
      parentPosts[parentPosts.length - 1].target &&
      Object.keys(parentPosts[parentPosts.length - 1].target).length > 0 &&
      parentPosts[parentPosts.length - 1].target.postHash
    ) {
      parentPosts.push(
        internalStore.postsByHash[
          parentPosts[parentPosts.length - 1].target.postHash
        ]
      );
    }
  }

  return parentPosts;
};
