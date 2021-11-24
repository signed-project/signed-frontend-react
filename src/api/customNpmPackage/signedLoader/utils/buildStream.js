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
  userInfo,
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
    rootPosts = userInfo.loadedRootPosts.filter(
      (rootPost) => rootPost.source.address === postsSource
    );
  } else {
    rootPosts = filterPostsBySources({
      posts: userInfo.loadedRootPosts,
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

    if (foundIndexOfAfterPost > -1) {
      actualRootPosts = rootPosts.slice(
        foundIndexOfAfterPost,
        limit + foundIndexOfAfterPost
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
