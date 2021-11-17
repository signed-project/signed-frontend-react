import { filterPostsBySources } from "./helpers/filterPostsBySources";

export const getReplies = ({
  internalStore,
  postsSource,
  post,
  subscribedSourcesByAddress,
  blacklistedSourcesByAddress,
}) => {
  let replies = internalStore.postsByTargetHash[post.hash];
  const postWithReplies = [];

  if (!replies) {
    return [];
  }

  if (!postsSource) {
    replies = filterPostsBySources({
      posts: replies,
      subscribedSourcesByAddress,
      blacklistedSourcesByAddress,
    });
  }

  replies = replies.sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );

  replies.forEach((reply) => {
    postWithReplies.push(reply);
    postWithReplies.push(
      ...getReplies({
        internalStore,
        post: reply,
        subscribedSourcesByAddress,
        blacklistedSourcesByAddress,
      })
    );
  });

  return postWithReplies;
};
