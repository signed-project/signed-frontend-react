export const filterPostsBySources = ({
  posts,
  subscribedSourcesByAddress,
  blacklistedSourcesByAddress,
}) => {
  return posts.filter(
    (post) =>
      !(post.source.address in blacklistedSourcesByAddress) &&
      post.signatures.some(
        (signature) => signature.address in subscribedSourcesByAddress
      )
  );
};

export const findIndexOfPost = ({ post, rootPosts }) => {
  let foundIndexOfPost = rootPosts.findIndex(
    (rootPost) =>
      rootPost.source.address === post.source.address && rootPost.id === post.id
  );

  if (foundIndexOfPost <= -1) {
    foundIndexOfPost = rootPosts.findIndex(
      (rootPost) => rootPost.createdAt === post.createdAt
    );
  }

  return foundIndexOfPost;
};
