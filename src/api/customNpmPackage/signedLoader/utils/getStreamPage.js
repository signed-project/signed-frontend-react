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
    callback(stream);
  };

  // Создаем обработчик колбеков от лоадера, который
  // Инициирует фоновую загрузку данных
  // мо мере загрузки он обновляет internalStore и многократно вызывает onLoadMore
  loadMore({ internalStore, stream, sources, afterPost, limit, onLoadMore });

  // Возвращаем что есть пока
  return stream;
};
