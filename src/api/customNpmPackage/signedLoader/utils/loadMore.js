import { loadIndexes } from "./loadIndexes";

// Скачивалка индексов и архивов
export const loadMore = ({
  internalStore,
  stream,
  subscribedSourcesByAddress,
  callback,
  userInfo,
  userStatuses,
}) => {
  // Для каждого источника проверяем, загружен ли его индекс и если нет, запускаем загрузку индекса
  // После скачки и обработки каждого индекса вызываем callback
  loadIndexes({
    internalStore,
    subscribedSourcesByAddress,
    callback,
    userInfo,
    userStatuses,
  });

  let unixtime = Math.floor(Date.now());
  let maxDepth = -1;

  if (stream.length > 0) {
    maxDepth = stream[stream.length - 1].rootPost.createdAt - 24 * 3600; // Один день от последнего поста в текущей ленте
  } else {
    maxDepth = unixtime - 24 * 3600;
  }

  if (
    internalStore.archiveDepth === 0 ||
    new Date(maxDepth) < new Date(internalStore.archiveDepth)
  ) {
    internalStore.archiveDepth = maxDepth;
  }
};
