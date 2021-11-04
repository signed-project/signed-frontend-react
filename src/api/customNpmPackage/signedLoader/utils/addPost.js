import { validatePost } from "./validation";

// Добавляем пост в internalStore
// Этот метод вызывается методами loadIndexes и loadArchives для каждого загруженного поста
export const addPost = ({ internalStore, post }) => {
  // Проверим подписи и наличие необходимых полей в объекте
  if (validatePost({ post })) {
    internalStore.postsByHash[post.hash] = post;
    const id = post.source.address + post.id;

    if (!post.target) {
      internalStore.rootPosts.push(post);
    } else {
      const postHash = post.target.postHash;

      if (postHash in internalStore.postsByTargetHash) {
        const replyPosts = internalStore.postsByTargetHash[postHash].slice();

        replyPosts.push(post);

        internalStore.postsByTargetHash[postHash] = replyPosts;
      } else {
        internalStore.postsByTargetHash[postHash] = [post];
      }
    }

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
