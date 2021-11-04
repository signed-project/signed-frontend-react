/*
  Лента это массив тредов. Тред это объект содержащий корневой пост и массив ответов к нему. 
  Thread = {
      rootPost: {},
      replies: []
  }
  Корневой пост, который не является ответом ни к какому другому посту. 
*/

export const buildStream = ({
  internalStore,
  sources,
  blacklistedSources,
  afterPost,
  limit,
}) => {
  let rootPosts = internalStore.rootPosts.slice();

  sources.map((source) => {
    rootPosts = rootPosts.filter((rootPost) => {
      let ok = false;

      rootPost.signatures.map((signature) => {
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

  rootPosts = rootPosts.sort(
    (a, b) => new Date(b.createAt) - new Date(a.createAt)
  );
  // get rootPosts
  // filter rootPosts === from sources and !== blacklisted sources
  // sort posts by date <<
  // slice posts from afterPost to limit
  // if afterPost did not find in posts then get it createdAt property
  // for every post apply getReplies method
};
