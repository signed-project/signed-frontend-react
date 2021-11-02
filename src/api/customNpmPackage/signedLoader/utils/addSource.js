import { validateSource } from "./validation";

// Добавляем source в internalStore
// Этот метод вызывается метадом loadIndexes для каждого загруженного источника
export const addSource = ({ internalStore, source }) => {
  // Проверим подписи и наличие необходимых полей в объекте
  if (validateSource(source)) {
    internalStore.sourcesByAddress[source.address] = source;
    return true;
  }

  return false;
};
