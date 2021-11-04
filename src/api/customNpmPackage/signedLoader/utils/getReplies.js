export const getReplies = ({
  internalStore,
  post,
  sources,
  blacklistedSources,
}) => {
  let replies = internalStore.postsByTargetHash[post.hash].slice();

  if (!replies) {
    return [];
  }

  sources.map((source) => {
    replies = replies.filter((reply) => {
      let ok = false;

      reply.signatures.map((signature) => {
        if (
          signature.address === source.address &&
          !(signature.address in blacklistedSources)
        ) {
          ok = true;
        }

        return;
      });

      return ok;
    });

    return;
  });

  replies = replies.sort((a, b) => new Date(a.createAt) - new Date(b.createAt));

  return [
    ...replies,
    ...getReplies({ internalStore, post, sources, blacklistedSources }),
  ];
};
