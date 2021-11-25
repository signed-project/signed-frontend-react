import { buildStream } from "./utils/buildStream.js";
import { loadArchives } from "./utils/loadArchives.js";
import { loadMore } from "./utils/loadMore.js";
import { getReplies } from "./utils/getReplies.js";
import { getParentPosts } from "./utils/getParentPosts.js";
import { addPost } from "./utils/addPost.js";

let init = true;

export const userStatuses = {
  ACTIVE: "ACTIVE",
  IDLE: "IDLE",
};

const internalStore = {
  // all posts includes postsById
  postsByHash: {},

  // all actual posts (post (rootPost), reply, repost, like)
  postsById: {},

  // post.target?.postHash : posts[] with the same hash as post.target.postHash
  postsByTargetHash: {
    reply: {},
    like: {},
    repost: {},
  },

  // posts with type such as like, repost, post but not reply
  rootPosts: [],

  // all archives => hash: JSON.parse(hash.json)
  archivesByHash: {},

  // actual time range
  archiveDepth: 0, // 1628888400000 (14 aug 2021) / 1620162000000 (05.05.2021) - for test loading of archives

  // source.hosts.index => { index }
  indexesByAddress: {},

  // source.hosts.index => { source }
  sourcesByAddress: {},

  blacklistedSourcesByAddress: {},
};

const userInfo = {
  status: userStatuses.IDLE,
  streamForUpdate: [],
  lengthOfLoadedRootPosts: 0,
  loadedRootPosts: [],
};

/*
 * Лента это массив тредов. Тред это объект содержащий корневой пост и массив ответов к нему. 
 * Thread = {
 *      rootPost: {},
 *      replies: []
 * }
 * Корневой пост, который не является ответом ни к какому другому посту. 

 * На вход передается
 * subscribedSources - массив источников
 * afterPost - последний корневой пост предыдущей страницы, может быть пустым (значит запрашиваем первую страницу ленты)
 * limit - сколько корневых постов вернуть в результате, например, 100
 * callback - вызывается когда появились новые корневые посты и/или ответы к постам страницы
 * Границы страницы определяются возвращенным первыи и последним постами
 * callback({stream}) -  на вход коллбеку отправляем страницу ленты собранную из постов, загруженных в настоящее время
*/
export const getStreamPage = ({
  postsSource,
  subscribedSources,
  blacklistedSourcesByAddress,
  afterPost,
  endPost,
  limit,
  callbackForUpdateStream,
  callbackForUpdatePostsNumber,
  showLoadedPosts,
}) => {
  // FIXME: We decided use only hashmaps for convenience
  const subscribedSourcesByAddress = {};
  let intervalForEvery_Five_Seconds = 0;
  let intervalForEvery_One_Minute = 0;

  subscribedSources.forEach((source) => {
    subscribedSourcesByAddress[source.address] = source;
  });

  if (showLoadedPosts) {
    userInfo.lengthOfLoadedRootPosts = internalStore.rootPosts.length;
    userInfo.loadedRootPosts = internalStore.rootPosts.slice();

    callbackForUpdatePostsNumber({
      lengthOfInternalRootPosts: internalStore.rootPosts.length,
      lengthOfUserRootPosts: userInfo.lengthOfLoadedRootPosts,
    });
  }

  // Cтроим ленту из тех данных, которые есть в internalStore
  let stream = buildStream({
    internalStore,
    userInfo,
    postsSource,
    subscribedSourcesByAddress,
    blacklistedSourcesByAddress,
    afterPost,
    endPost,
    limit,
  });

  if (showLoadedPosts) {
    userInfo.streamForUpdate = stream;
  }

  let updateUserStreamIfIdle = null;

  if (init) {
    updateUserStreamIfIdle = () => {
      if (userInfo.status === userStatuses.IDLE) {
        callbackForUpdateStream({
          stream: userInfo.streamForUpdate,
        });
      } else {
        clearInterval(intervalForEvery_Five_Seconds);
      }
    };

    intervalForEvery_Five_Seconds = setInterval(() => {
      // updateUserStreamIfIdle();
    }, 1000 * 5);
  }

  const onLoadMore = () => {
    stream = buildStream({
      internalStore,
      userInfo,
      postsSource,
      subscribedSourcesByAddress,
      blacklistedSourcesByAddress,
      afterPost,
      endPost,
      limit,
    });

    if (init) {
      userInfo.streamForUpdate = stream;

      updateUserStreamIfIdle();
    }

    callbackForUpdatePostsNumber({
      lengthOfInternalRootPosts: internalStore.rootPosts.length,
      lengthOfUserRootPosts: userInfo.lengthOfLoadedRootPosts,
    });

    // Запускаем скачивание любого архива у которого dateStart > archiveDepth
    // После скачки и обработки каждого архива вызываем callback
    loadArchives({
      internalStore,
      subscribedSourcesByAddress,
      callback: onLoadMore,
      userInfo,
      userStatuses,
    });
  };

  // Создаем обработчик колбеков от лоадера, который
  // Инициирует фоновую загрузку данных
  // мо мере загрузки он обновляет internalStore и многократно вызывает onLoadMore
  loadMore({
    internalStore,
    stream,
    subscribedSourcesByAddress,
    callback: onLoadMore,
    userInfo,
    userStatuses,
  });

  if (init) {
    intervalForEvery_One_Minute = setInterval(() => {
      loadMore({
        internalStore,
        stream,
        subscribedSourcesByAddress,
        callback: onLoadMore,
        userInfo,
        userStatuses,
      });
    }, 1000 * 60);
  }

  return stream;
};

export const setStatusUser = (status) => {
  init = false;

  if (status in userStatuses) {
    userInfo.status = status;
  }
};

export const addPostToStream = ({ post, sources }) => {
  addPost({ internalStore, userInfo, userStatuses, post });

  const stream = getStreamPage({
    postsSource: "",
    subscribedSources: sources,
    blacklistedSourcesByAddress: {},
    afterPost: {},
    limit: 10,
    callbackForUpdateStream: () => {},
    callbackForUpdatePostsNumber: () => {},
    showLoadedPosts: true,
  });

  return {
    lengthOfUserRootPosts: userInfo.lengthOfLoadedRootPosts,
    lengthOfInternalRootPosts: internalStore.rootPosts.length,
    stream,
  };
};

export const getParentPostsForComment = ({
  postHashToComment,
  subscribedSources,
}) => {
  const returnObject = {};
  let parentPosts = [];
  const subscribedSourcesByAddress = {};

  subscribedSources.forEach((source) => {
    subscribedSourcesByAddress[source.address] = source;
  });

  const currPost = internalStore.postsByHash[postHashToComment];

  if (currPost.type === "reply") {
    parentPosts = getParentPosts({
      internalStore,
      post: currPost,
      subscribedSourcesByAddress,
      blacklistedSourcesByAddress: {},
    });

    const indexOfRootPost = parentPosts.findIndex(
      (parentPost) =>
        !parentPost.target || (parentPost.target && !parentPost.target.postHash)
    );

    if (indexOfRootPost > -1) {
      returnObject.rootPost = parentPosts.splice(indexOfRootPost, 1)[0];
      parentPosts = parentPosts.reverse();
      returnObject.replies = [...parentPosts, currPost];
    }
  } else {
    returnObject.rootPost = currPost;
    returnObject.replies = [];
  }

  return returnObject;
};

export const getReplyPostsForComment = ({
  postHashToComment,
  subscribedSources,
}) => {
  let replies = [];
  const subscribedSourcesByAddress = {};

  subscribedSources.forEach((source) => {
    subscribedSourcesByAddress[source.address] = source;
  });

  const currPost = internalStore.postsByHash[postHashToComment];

  replies = getReplies({
    internalStore,
    post: currPost,
    subscribedSourcesByAddress,
    blacklistedSourcesByAddress: {},
  });

  return replies;
};

export const getPostByHash = ({ hash, subscribedSources }) => {
  const returnObject = {};
  let parentPosts = [];
  let replies = [];
  const subscribedSourcesByAddress = {};

  subscribedSources.forEach((source) => {
    subscribedSourcesByAddress[source.address] = source;
  });

  const currPost = internalStore.postsByHash[hash];

  if (currPost.type === "reply") {
    parentPosts = getParentPosts({
      internalStore,
      post: currPost,
      subscribedSourcesByAddress,
      blacklistedSourcesByAddress: {},
    });

    replies = getReplies({
      internalStore,
      post: currPost,
      subscribedSourcesByAddress,
      blacklistedSourcesByAddress: {},
    });

    const rootPost = parentPosts.splice(-1, 1)[0];
    parentPosts = parentPosts.reverse();
    replies.unshift(...parentPosts, currPost);

    returnObject.clickedPost = currPost;
    returnObject.rootPost = rootPost;
    returnObject.replies = replies;
  } else {
    replies = getReplies({
      internalStore,
      post: currPost,
      subscribedSourcesByAddress,
      blacklistedSourcesByAddress: {},
    });

    returnObject.clickedPost = currPost;
    returnObject.rootPost = currPost;
    returnObject.replies = replies;
  }

  return returnObject;
};

export const getAllSources = () => {
  return internalStore.sourcesByAddress;
};

export const getSourceByAddress = (address) => {
  return internalStore.sourcesByAddress[address];
};
