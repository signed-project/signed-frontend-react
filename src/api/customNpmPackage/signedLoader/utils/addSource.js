const { validateSource } = require("./validation");

// Добавляем source в internalStore
// Этот метод вызывается метадом loadIndexes для каждого загруженного источника
const addSource = ({ internalStore, source }) => {
  // Проверим подписи и наличие необходимых полей в объекте
  if (validateSource({ source })) {
    let returnSource = {};

    if (source.address in internalStore.sourcesByAddress) {
      const existingSource = internalStore.sourcesByAddress[source.address];
      if (existingSource.updatedAt < source.updatedAt) {
        returnSource = existingSource;
        internalStore.sourcesByAddress[existingSource.address] = source; // Заменяем источник более новым
      }
    } else {
      returnSource = source;
      internalStore.sourcesByAddress[source.address] = source; // Создаем новый элемент
    }

    return returnSource;
  }

  return false;
};

module.exports = {
  addSource,
};
