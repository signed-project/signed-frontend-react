/*
  Лента это массив тредов. Тред это объект содержащий корневой пост и массив ответов к нему. 
  Thread = {
      rootPost: {},
      replies: []
  }
  Корневой пост, который не является ответом ни к какому другому посту. 
*/

import { getReplies } from "./getReplies";

import { filterPostsBySources } from "./helpers/filterPostsBySources";

export const buildStream = ({
  internalStore,
  postsSource,
  subscribedSourcesByAddress,
  blacklistedSourcesByAddress,
  afterPost,
  limit,
}) => {
  const stream = [];
  let actualRootPosts = [];
  let rootPosts = [];

  if (postsSource) {
    rootPosts = internalStore.rootPosts.filter(
      (rootPost) => rootPost.source.address === postsSource
    );
  } else {
    rootPosts = filterPostsBySources({
      posts: internalStore.rootPosts,
      subscribedSourcesByAddress,
      blacklistedSourcesByAddress,
    });
  }

  rootPosts = rootPosts.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  if (afterPost && Object.keys(afterPost).length > 0) {
    let foundIndexOfAfterPost = rootPosts.findIndex(
      (rootPost) =>
        rootPost.source.address === afterPost.source.address &&
        rootPost.id === afterPost.id
    );

    if (!foundIndexOfAfterPost && foundIndexOfAfterPost !== 0) {
      foundIndexOfAfterPost = rootPosts.findIndex(
        (rootPost) => rootPost.createdAt === afterPost.createdAt
      );

      if (foundIndexOfAfterPost) {
        actualRootPosts = rootPosts.slice(
          foundIndexOfAfterPost,
          limit + foundIndexOfAfterPost
        );
      }
    } else {
      actualRootPosts = rootPosts.slice(
        foundIndexOfAfterPost,
        limit + foundIndexOfAfterPost
      );
    }
  } else {
    actualRootPosts = rootPosts.slice(0, limit);
  }

  actualRootPosts.forEach((actualRootPost) => {
    const replies = getReplies({
      postsSource,
      internalStore,
      post: actualRootPost,
      subscribedSourcesByAddress,
      blacklistedSourcesByAddress,
    });

    stream.push({
      rootPost: actualRootPost,
      replies,
    });
  });

  return stream;
};
