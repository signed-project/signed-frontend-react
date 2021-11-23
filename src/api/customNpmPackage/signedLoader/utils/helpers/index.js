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

export const postsDistribution = ({ internalStore, post }) => {
  const postHash = post.target.postHash;

  switch (post.type) {
    case "reply": {
      if (postHash in internalStore.postsByTargetHash.reply) {
        const replyPosts =
          internalStore.postsByTargetHash.reply[postHash].slice();

        replyPosts.push(post);

        internalStore.postsByTargetHash.reply[postHash] = replyPosts;
      } else {
        internalStore.postsByTargetHash.reply[postHash] = [post];
      }
      break;
    }
    case "like": {
      if (postHash in internalStore.postsByTargetHash.like) {
        const replyPosts =
          internalStore.postsByTargetHash.like[postHash].slice();

        replyPosts.push(post);

        internalStore.postsByTargetHash.like[postHash] = replyPosts;
      } else {
        internalStore.postsByTargetHash.like[postHash] = [post];
      }
      break;
    }
    case "repost": {
      if (postHash in internalStore.postsByTargetHash.repost) {
        const replyPosts =
          internalStore.postsByTargetHash.repost[postHash].slice();

        replyPosts.push(post);

        internalStore.postsByTargetHash.repost[postHash] = replyPosts;
      } else {
        internalStore.postsByTargetHash.repost[postHash] = [post];
      }
      break;
    }
    default: {
      internalStore.rootPosts.push(post);
    }
  }
};
