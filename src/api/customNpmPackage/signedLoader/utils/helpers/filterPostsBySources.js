const filterPostsBySources = ({
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

module.exports = {
  filterPostsBySources,
};
