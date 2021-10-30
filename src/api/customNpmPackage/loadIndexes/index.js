import axios from "axios";

// TODO: Добавить функцию загрузки архивов
// getArchives({ archives, callbackReceivedArchives, callbackAddTempPostArr, ... и др колбеки})

// Desired state - это "желаемое состояние", и есть Current state - текущее состояние
// пример: мы хотим чтобы текущее состояние = все индексы загружены, но так не получается сразу, потому что они грузятся медленно и вообще могут не загрузиться
// но мы можем моментально изменить желаемое состояние, а потом постепенно в фоновом режиме приводить текущее к желаемому
//
// Как работает лента:
// Исходное желаемое состояние = все источники/индексы загружены, в ленте показан последний 1 час постов (посты у которых dateCreated > now() - 1hr)
// Текущее состояние: нет загруженных индексов -> частично загружены -> полностью загружены
// Как понять что в части часов постов текущее состояние = желаемое?
//   - Нам не известно ни одного архива который пересекается по датам с желаемым диапазоном (сейчас - XX часов) и еще не был загружен
// Когда пользователь доскроллил до конца ленты и сейчас нет фоновой загрузки индексов или архивов, желаемый диапазон расширяется на 1 час назад
// Вопрос: когда обновлять ленту на экране?
//   - давайте для простоты пока сделаем кнопку "Show XX new posts" которая прилипает к нижней границе экрана.
//   - кнопку показываем только когда есть новые посты (есть чего обновлять)
//
// visibleStream - это посты на экране
// currentStream - это посты которые попадают в желаемый временной диапазон ленты (содержат часть visibleStream)
// loadedStream - это посты все загруженные
// При нажатии "Show XX new posts" ты делаешь visibleStream = currentStream. XX = currentStream.length - visibleStream.length
// При расширенни временного диапазона - currentStream = loadedStream.filter(dateCreated > now() - YY hr)

// Потом решим когда
// - обновлять ленту на экране (пока это по кнопке)
// - расширять диапазон (пока это тоже по кнопке)
// - обновлять индексы - тут будет websockets скорее всего и мы будем узнавать когда какой-то источник опубликовал что-то новое

const getSourcesIndex = async ({
  sources,
  setAllReceivedSourcesNumber,
  setCurrentAlreadySetSourcesNumber,
  addTempPostArr,
  setAddTempSourceItem,
  setLoadedStream,
}) => {
  console.log("getSubscribedIndex[subscribed.length]", sources.length);

  setAllReceivedSourcesNumber(sources.length);

  let gatheredPosts = [],
    hostSources = [];

  const loadedStream = {
    archives: [],
    recentPosts: {
      startDate: 0,
      endDate: 0,
      posts: [],
    },
  };
  let tempArrOfRecentPosts = [];

  try {
    await Promise.allSettled(
      sources.map(async (src, i) => {
        setCurrentAlreadySetSourcesNumber(i + 1);

        console.log("src");
        console.dir(src);

        await Promise.allSettled(
          src.hosts.map(async (hst) => {
            let res = await axios.get(`${hst.index}`);

            console.log("res");
            console.dir(res);

            if (res?.data?.index?.recentPosts) {
              const indexPosts = res?.data?.index?.recentPosts;

              if (Array.isArray(indexPosts) && indexPosts.length > 0) {
                // addTempPostArr(indexPosts);
                // FIXME: Temp code
                tempArrOfRecentPosts.push(...indexPosts);
              }
            }

            if (res.data.index.archives?.length) {
              loadedStream.archives.push(...res.data.index.archives);
            }

            // Если в res есть информация о том, что имеется архивы либо нет
            // тогда лучше сделать на это проверку и уже тогда делать запрос по хэшу.json
            // так же должно быть в элементах массива archives поле address соответствующий к текущему source
            // if (res.data.index.archives.length ? hst.assets/src.address.json : void);

            if (res?.data?.source) {
              setAddTempSourceItem(res?.data?.source);
            }

            return;
          })
        );
      })
    );

    tempArrOfRecentPosts.map((post) => {
      loadedStream.archives = loadedStream.archives.map((archive) => {
        if (
          post.createdAt >= archive.startDate &&
          post.createdAt <= archive.endDate
        ) {
          if (archive.recentPosts) {
            archive.recentPosts.push(post);
          } else {
            archive.recentPosts = [];
            archive.recentPosts.push(post);
          }
        } else {
          loadedStream.recentPosts.posts.push(post);
        }

        return archive;
      });

      return;
    });

    let max = Number.MAX_SAFE_INTEGER * -1;
    let min = Number.MAX_SAFE_INTEGER;

    loadedStream.recentPosts.posts.map((post) => {
      if (post.createdAt < min) {
        min = post.createdAt;
      }

      if (post.createdAt > max) {
        max = post.createdAt;
      }

      return;
    });

    console.log("min");
    console.dir(min);

    console.log("max");
    console.dir(max);

    loadedStream.recentPosts.startDate = min;
    loadedStream.recentPosts.endDate = max;

    setLoadedStream(loadedStream);

    console.log("loadedStream");
    console.dir(loadedStream);

    console.log("tempArrOfRecentPosts");
    console.dir(tempArrOfRecentPosts);

    console.log("notAppropriateRecentPostsByRangeOfTime");
    console.dir(loadedStream.recentPosts);
  } catch (e) {
    console.warn("[getSubscribedIndex][Promise.all]", e);
  }

  return { gatheredPosts, hostSources };
};

const getDefaultSources = async ({
  dispatch,
  setAllReceivedSourcesNumber,
  setCurrentAlreadySetSourcesNumber,
  addTempPostArr,
  setAddTempSourceItem,
  sourceActions,
  postActions,
  getSubscribedPath,
  setLoadedStream,
}) => {
  let data;
  try {
    ({ data } = await axios.get(getSubscribedPath));
    console.log("[getDefaultSources][]data", data.length);
  } catch (e) {
    console.warn("[getDefaultSources][getDefaultSources]", e);
  }
  try {
    await getSourcesIndex({
      sources: data,
      setAllReceivedSourcesNumber,
      setCurrentAlreadySetSourcesNumber,
      addTempPostArr,
      setAddTempSourceItem,
      setLoadedStream,

      dispatch,
      sourceActions,
      postActions,
    });
  } catch (e) {
    console.warn(
      "[getDefaultSources][getDefaultSources][getDefaultSources]",
      e
    );
  }
};

export { getDefaultSources, getSourcesIndex };
