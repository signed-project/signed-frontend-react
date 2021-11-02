export const buildStream = ({ internalStore, sources, afterPost, limit }) => {
  // Проходит по всем постам в internalStore.postsById и отбирает те, которые
  // - являются корневыми
  // - попадают в диапазон заданный afterPost, limit
  // - если не указан afterPost, то условие по afterPost не применяем
  rootPosts = getRootPosts({ internalStore, sources, afterPost, limit });

  // Создаем индекс threadsByHash из rootPosts - у каждого thread пустой массив ответов
  // Проходим по всем постам в internalStore.postsById и те, которые ссылаются на тред
  // из threadsByHash, добавляем в массив ответов соответсвующего треда
  stream = addRepliesToThreads({ internalStore, rootPosts });
};
