import { validatePost } from "./validation";
import { postsDistribution } from "./helpers";

// Добавляем пост в internalStore
// Этот метод вызывается методами loadIndexes и loadArchives для каждого загруженного поста
export const addPost = ({ internalStore, userInfo, userStatuses, post }) => {
  // Проверим подписи и наличие необходимых полей в объекте + исключаем дубли постов по хэшу
  if (!(post.hash in internalStore.postsByHash) && validatePost({ post })) {
    internalStore.postsByHash[post.hash] = post;
    const id = post.source.address + post.id;

    postsDistribution({ internalStore, userInfo, userStatuses, post });

    if (id in internalStore.postsById) {
      const existing = internalStore.postsById[id];

      if (existing.updatedAt < post.updatedAt) {
        internalStore.postsById[id] = post; // Заменяем пост более новым
      }
    } else {
      internalStore.postsById[id] = post; // Создаем новый элемент
    }

    return true;
  }

  return false;
};
