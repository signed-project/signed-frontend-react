const { loadIndexes } = require("./loadIndexes");

// Скачивалка индексов и архивов
const loadMore = ({
  internalStore,
  stream,
  subscribedSourcesByAddress,
  callback,
}) => {
  // Для каждого источника проверяем, загружен ли его индекс и если нет, запускаем загрузку индекса
  // После скачки и обработки каждого индекса вызываем callback
  loadIndexes({ internalStore, subscribedSourcesByAddress, callback });

  let unixtime = Math.floor(Date.now() / 1000);
  let maxDepth = -1;

  if (stream.length > 0) {
    maxDepth = stream.at(-1).rootPost.createdAt - 24 * 3600; // Один день от последнего поста в текущей ленте
  } else {
    maxDepth = unixtime - 24 * 3600;
  }

  if (internalStore.archiveDepth < maxDepth) {
    internalStore.archiveDepth = maxDepth;
  }
};

module.exports = {
  loadMore,
};
