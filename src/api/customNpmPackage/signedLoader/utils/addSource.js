// Добавляем source в internalStore
// Этот метод вызывается методами loadIndexes и loadArrays для каждого загруженного источника
const addSource = ({ internalStore, source }) => {
  // Проверим подписи и наличие необходимых полей в объекте
  if (validatePost(source)) {
    sourcesByAddress[source.hash] = source;
    id = post.source.address + post.id;
    if (id in postsById) {
      existing = postsById[id];
      if (existing.dateUpdated < post.dateUpdated) {
        postsById[id] = post; // Замещаем пост более новым
      }
    } else postsById[id] = post; // Создаем новый элемент
    return true;
  }
  return false;
};
