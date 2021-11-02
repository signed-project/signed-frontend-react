import { validatePost } from "./validation";

// Добавляем пост в internalStore
// Этот метод вызывается методами loadIndexes и loadArrays для каждого загруженного поста
export const addPost = ({ internalStore, post }) => {
  // Проверим подписи и наличие необходимых полей в объекте
  if (validatePost({ post })) {
    internalStore.postsByHash[post.hash] = post;
    const id = post.source.address + post.id;

    if (id in internalStore.postsById) {
      const existing = internalStore.postsById[id];

      if (existing.dateUpdated < post.dateUpdated) {
        internalStore.postsById[id] = post; // Заменяем пост более новым
      }
    } else {
      internalStore.postsById[id] = post; // Создаем новый элемент
    }

    return true;
  }

  return false;
};
