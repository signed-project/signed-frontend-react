// Внутренний стор данных, НЕ ИСПОЛЬЗУЕТ REDUX
internalStore = {
  // Индекс постов по хэшу, в него всегда добавляем все посты которых там нет
  postsByHash: {},

  // Индекс постов по составному ключу (source_address + post_id)
  // Всегда добавляем если нет записи, но обновляем только если dateUpdated
  // нового поста больше чем dateUpdated поста которые сейчас находится в индексе
  postsById: {},

  // Индекс источников по адресу источника
  // Всегда добавляем если нет записи, но обновляем только если dateUpdated
  // нового источника больше чем dateUpdated источника который сейчас находится в индексе
  sourcesByAddress: {},

  // Все скачанные архивы по хэшу. При скачке любого архива добавляем его в этот индекс
  archivesByHash: {},

  // Глубина скачки архивов в часах. Мы скачиваем любой архив у которого dateStart > archiveDepth
  archiveDepth: 1635675379, // Значение для примера

  // Все скачанные индексы по адресу источника. При повторной скачке индекса перезаписываем
  // "Индекс" содержит в себе и массив архивов и массив recentPosts
  indexesByAddress: {},
};

/*
 * Лента это массив тредов. Тред это объект содержащий корневой пост и массив ответов к нему. 
 * Thread = {
 *      rootPost: {},
 *      replies: []
 * }
 * Корневой пост, который не является ответом ни к какому другому посту. 

 * На вход передается
 * sources - массив источников
 * afterPost - последний корневой пост предыдущей страницы, может быть пустым (значит запрашиваем первую страницу ленты)
 * limit - сколько корневых постов вернуть в результате, например, 100
 * callback - вызывается когда появились новые корневые посты и/или ответы к постам страницы
 * Границы страницы определяются возвращенным первыи и последним постами
 * callback({stream}) -  на вход коллбеку отправляем страницу ленты собранную из постов, загруженных в настоящее время
 */
const getStreamPage = ({ sources, afterPost, limit, callback }) => {
  // Cтроим ленту из тех данных, которые есть в internalStore
  stream = buildStream({ internalStore, sources, afterPost, limit });

  onLoadMore = () => {
    stream = buildStream({ internalStore, sources, afterPost, limit });
    callback(stream); // callback this is function from Redux store for update visiable stream
  };

  // Создаем обработчик колбеков от лоадера, который
  // Инициирует фоновую загрузку данных
  // мо мере загрузки он обновляет internalStore и многократно вызывает onLoadMore
  loadMore({ internalStore, stream, sources, afterPost, limit, onLoadMore });

  // Возвращаем что есть пока
  return stream;
};

/**
 * loadIndexes - pass through sources and get indexes => archives & recentPosts & sources instance
 * loadArchives - we will call it for download archives
 * buildStream - build a stream on page
 * addPost - we will use it in loadArchives & loadIndexes
 * addSource - we will use it in loadIndexes
 * getPageStream - we will use it in Feed component for get stream on page and pass callback for update visiable stream on page
 * callback - this is a Redux function for update visiable stream on page
 * loadMore - this is a callback for update internalStore stream and call the callback Redux function
 */

/**
 * addPost & addSource | 1
 * loadIndexes | 2
 * loadArchives | 3
 * buildStream | 4
 * loadMore | 5
 * getPageStream | 6
 * callback | 7
 */

const buildStream = ({ internalStore, sources, afterPost, limit }) => {
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

// Скачивалка индексов и архивов
const loadMore = ({
  internalStore,
  stream,
  sources,
  afterPost,
  limit,
  callback,
}) => {
  // Для каждого источника проверяем, загружен ли его индекс и если нет, запускаем загрузку индекса
  // После скачки и обработки каждого индекса вызываем callback
  loadIndexes({ internalStore, sources, callback });

  unixtime = Math.floor(Date.now() / 1000);

  if (stream.length > 0) {
    maxDepth = stream.at(-1).post.dateCreated - 24 * 3600; // Один день от последнего поста в текущей ленте
  } else maxDepth = unixtime - 24 * 3600;

  if (maxDepth < internalStore.archiveDepth)
    internalStore.archiveDepth = maxDepth;

  // Запускаем скачивание любого архива у которого dateStart > archiveDepth
  // После скачки и обработки каждого архива вызываем callback
  loadArrays({ internalStore, sources, callback });
};

// Добавляем пост в internalStore
// Этот метод вызывается методами loadIndexes и loadArrays для каждого загруженного поста
const addPost = ({ internalStore, post }) => {
  // Проверим подписи и наличие необходимых полей в объекте
  if (validatePost(post)) {
    postsByHash[post.hash] = post;
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

// Добавляем source в internalStore
// Этот метод вызывается методами loadIndexes и loadArrays для каждого загруженного источника
const addSource = ({ internalStore, source }) => {
  // по аналогии см выше
};
