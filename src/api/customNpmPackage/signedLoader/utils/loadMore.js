import { loadIndexes } from "./loadIndexes";

// Скачивалка индексов и архивов
export const loadMore = ({
  internalStore,
  stream,
  subscribedSourcesByAddress,
  callback,
}) => {
  // Для каждого источника проверяем, загружен ли его индекс и если нет, запускаем загрузку индекса
  // После скачки и обработки каждого индекса вызываем callback
  loadIndexes({ internalStore, subscribedSourcesByAddress, callback });

  let unixtime = Math.floor(Date.now());
  let maxDepth = -1;

  if (stream.length > 0) {
    console.log("WE HERE & stream length is bigger then 0");
    maxDepth = stream.at(-1).rootPost.createdAt - 24 * 3600; // Один день от последнего поста в текущей ленте
  } else {
    maxDepth = unixtime - 24 * 3600;
  }

  console.log("stream");
  console.dir(stream);
  console.log("maxDepth");
  console.dir(maxDepth);
  console.log("internalStore.archiveDepth");
  console.dir(internalStore.archiveDepth);

  // mb it need fix
  if (
    internalStore.archiveDepth === 0 ||
    new Date(maxDepth) < new Date(internalStore.archiveDepth)
  ) {
    internalStore.archiveDepth = maxDepth;
  }
};
