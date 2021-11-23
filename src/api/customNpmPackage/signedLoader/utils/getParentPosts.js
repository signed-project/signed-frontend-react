export const getParentPosts = ({ internalStore, post }) => {
  let parentPosts = [];

  if (post.target) {
    parentPosts.push(internalStore.postsByHash[post.target.postHash]);

    while (parentPosts[parentPosts.length - 1].target) {
      parentPosts.push(
        internalStore.postsByHash[
          parentPosts[parentPosts.length - 1].target.postHash
        ]
      );
    }
  }

  return parentPosts;
};
