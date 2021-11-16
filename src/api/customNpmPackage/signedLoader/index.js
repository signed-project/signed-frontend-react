import { buildStream } from "./utils/buildStream.js";
import { loadArchives } from "./utils/loadArchives.js";
import { loadMore } from "./utils/loadMore.js";
import { getReplies } from "./utils/getReplies.js";

const internalStore = {
  // all posts includes postsById
  postsByHash: {},

  // all actual posts (post (rootPost), reply, repost, like)
  postsById: {},

  // post.target?.postHash : posts[] with the same hash as post.target.postHash
  postsByTargetHash: {},

  // posts with type such as like, repost, post but not reply
  rootPosts: [],

  // all archives => hash: JSON.parse(hash.json)
  archivesByHash: {},

  // actual time range
  archiveDepth: 0, // 1628888400000 (14 aug 2021) - for test loading of archives

  // source.hosts.index => { index }
  indexesByAddress: {},

  // source.hosts.index => { source }
  sourcesByAddress: {},

  blacklistedSourcesByAddress: {},
};

function outputInternalStore(internalStore) {
  console.log("onLoadMore");
  console.log("internalStore.archiveDepth ", internalStore.archiveDepth);
  console.log(
    "internalStore.archivesByHash ",
    Object.keys(internalStore.archivesByHash).length
  );
  console.log(
    "internalStore.postsByHash ",
    Object.keys(internalStore.postsByHash).length
  );
  console.log(
    "internalStore.postsById ",
    Object.keys(internalStore.postsById).length
  );
  console.log(
    "internalStore.postsByTargetHash ",
    Object.keys(internalStore.postsByTargetHash).length
  );
  console.log("internalStore.rootPosts ", internalStore.rootPosts.length);
  console.log(
    "internalStore.indexesByAddress ",
    Object.keys(internalStore.indexesByAddress).length
  );
  console.log(
    "internalStore.sourcesByAddress ",
    Object.keys(internalStore.sourcesByAddress).length
  );
}

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
  subscribedSources,
  blacklistedSourcesByAddress,
  afterPost,
  limit,
  callback,
}) => {
  // FIXME: We decided use only hashmaps for convenience
  const subscribedSourcesByAddress = {};

  subscribedSources.forEach((source) => {
    subscribedSourcesByAddress[source.address] = source;
  });

  // Cтроим ленту из тех данных, которые есть в internalStore
  let stream = buildStream({
    internalStore,
    subscribedSourcesByAddress,
    blacklistedSourcesByAddress,
    afterPost,
    limit,
  });

  console.log("INDEX STREAM");
  console.dir(stream);

  const onLoadMore = () => {
    outputInternalStore(internalStore);

    stream = buildStream({
      internalStore,
      subscribedSourcesByAddress,
      blacklistedSourcesByAddress,
      afterPost,
      limit,
    });

    callback({ stream, sourcePost: internalStore.sourcesByAddress });

    // Запускаем скачивание любого архива у которого dateStart > archiveDepth
    // После скачки и обработки каждого архива вызываем callback
    loadArchives({
      internalStore,
      subscribedSourcesByAddress,
      callback: onLoadMore,
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
  });

  return stream;
};

export const getPostByHash = ({ hash, subscribedSources }) => {
  const subscribedSourcesByAddress = {};

  subscribedSources.forEach((source) => {
    subscribedSourcesByAddress[source.address] = source;
  });

  const currPost = internalStore.postsByHash[hash];
  const replies = getReplies({
    internalStore,
    post: currPost,
    subscribedSourcesByAddress,
    blacklistedSourcesByAddress: {},
  });

  return {
    rootPost: currPost,
    replies,
  };
};
