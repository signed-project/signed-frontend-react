import { loadIndexes } from "./loadIndexes";
import { loadArchives } from "./loadArchives";

// Скачивалка индексов и архивов
export const loadMore = ({ internalStore, stream, sources, callback }) => {
  // Для каждого источника проверяем, загружен ли его индекс и если нет, запускаем загрузку индекса
  // После скачки и обработки каждого индекса вызываем callback
  loadIndexes({ internalStore, sources, callback });

  let unixtime = Math.floor(Date.now() / 1000);
  let maxDepth = -1;

  if (stream.length > 0) {
    maxDepth = stream.at(-1).rootPost.createdAt - 24 * 3600; // Один день от последнего поста в текущей ленте
  } else {
    maxDepth = unixtime - 24 * 3600;
  }

  if (maxDepth < internalStore.archiveDepth) {
    internalStore.archiveDepth = maxDepth;
  }

  // Запускаем скачивание любого архива у которого dateStart > archiveDepth
  // После скачки и обработки каждого архива вызываем callback
  loadArchives({ internalStore, sources, callback });
};
