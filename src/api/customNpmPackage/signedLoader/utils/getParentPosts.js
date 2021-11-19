export const getParentPosts = ({ internalStore, post }) => {
  let parentPosts = [];

  if (post.target) {
    const currPost = internalStore.postsByHash[post.target.postHash];
    parentPosts.push(currPost);

    if (currPost.target) {
      getParentPosts({
        post: currPost,
        internalStore,
      });
    }
  }

  return parentPosts;
};
