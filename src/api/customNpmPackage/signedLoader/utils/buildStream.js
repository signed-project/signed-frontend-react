/*
  Лента это массив тредов. Тред это объект содержащий корневой пост и массив ответов к нему. 
  Thread = {
      rootPost: {},
      replies: []
  }
  Корневой пост, который не является ответом ни к какому другому посту. 
*/

import { getReplies } from "./getReplies";

import { filterPostsBySources, findIndexOfPost } from "./helpers";

export const buildStream = ({
  internalStore,
  postsSource,
  subscribedSourcesByAddress,
  blacklistedSourcesByAddress,
  afterPost,
  endPost,
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
    const foundIndexOfAfterPost = findIndexOfPost({
      rootPosts,
      post: afterPost,
    });

    if (foundIndexOfAfterPost === rootPosts.length - 1) {
      actualRootPosts = rootPosts.slice(0, limit);
    } else if (foundIndexOfAfterPost > -1) {
      actualRootPosts = rootPosts.slice(
        foundIndexOfAfterPost,
        limit + foundIndexOfAfterPost
      );
    }
  } else if (endPost && Object.keys(endPost).length > 0) {
    const foundIndexOfEndPost = findIndexOfPost({
      rootPosts,
      post: endPost,
    });

    if (foundIndexOfEndPost === 0) {
      actualRootPosts = rootPosts.slice(
        rootPosts.length - limit,
        rootPosts.length
      );
    } else if (foundIndexOfEndPost > -1) {
      actualRootPosts = rootPosts.slice(
        foundIndexOfEndPost < limit ? 0 : foundIndexOfEndPost + 1 - limit,
        foundIndexOfEndPost + 1
      );
    }
  } else {
    // INIT-START
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
