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
  subscribedSourcesByAddress,
  blacklistedSourcesByAddress,
  afterPost,
  limit,
}) => {
  const stream = [];
  let actualRootPosts = [];
  let rootPosts = filterPostsBySources({
    posts: internalStore.rootPosts,
    subscribedSourcesByAddress,
    blacklistedSourcesByAddress,
  });

  rootPosts = rootPosts.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  console.log("buildStream sorted rootPosts");
  console.dir(rootPosts);

  console.log("afterPOST in buildStream");
  console.dir(afterPost);

  if (afterPost && Object.keys(afterPost).length > 0) {
    let foundIndexOfAfterPost = rootPosts.findIndex(
      (rootPost) =>
        rootPost.source.address === afterPost.source.address &&
        rootPost.id === afterPost.id
    );

    console.log("foundIndexOfAfterPost");
    console.dir(foundIndexOfAfterPost);

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

  console.log("actualRootPosts ", actualRootPosts.length);

  actualRootPosts.forEach((actualRootPost) => {
    const replies = getReplies({
      internalStore,
      post: actualRootPost,
      subscribedSourcesByAddress,
      blacklistedSourcesByAddress,
    });

    console.log("for ", actualRootPost.hash);
    console.dir(actualRootPost);

    console.log("replies ", replies.length);
    console.dir(replies);

    stream.push({
      rootPost: actualRootPost,
      replies,
    });
  });

  return stream;
};
