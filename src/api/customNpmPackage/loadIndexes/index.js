import axios from 'axios';

// TODO: Добавить функцию загрузки архивов
// getArchives({ archives, callbackReceivedArchives, callbackAddTempPostArr, ... и др колбеки})

const getSourcesIndex = async ({ sources, setAllReceivedSourcesNumber,
    setCurrentAlreadySetSourcesNumber,
    addTempPostArr, setAddTempSourceItem }) => {
    console.log('getSubscribedIndex[subscribed.length]', sources.length);
    setAllReceivedSourcesNumber(sources.length);
    let gatheredPosts = [],
        hostSources = [];

    try {
        await Promise.allSettled(
            sources.map(async (src, i) => {
                setCurrentAlreadySetSourcesNumber(i + 1)
                await Promise.allSettled(
                    src.hosts.map(async (hst) => {
                        let res = await axios.get(`${hst.index}`);
                        if (res?.data?.index?.recentPosts) {
                            const indexPosts = res?.data?.index?.recentPosts;
                            if (Array.isArray(indexPosts) && indexPosts.length > 0)
                                addTempPostArr(indexPosts)
                        }

                        if (res?.data?.source) {
                            setAddTempSourceItem(res?.data?.source)
                        }
                        return;
                    })
                );
            })
        );

    } catch (e) {
        console.warn("[getSubscribedIndex][Promise.all]", e);
    }

    return { gatheredPosts, hostSources };
};

const getDefaultSources = async ({ dispatch,
    setAllReceivedSourcesNumber, setCurrentAlreadySetSourcesNumber,
    addTempPostArr, setAddTempSourceItem,
    sourceActions, postActions, getSubscribedPath }) => {
    let data;
    try {
        ({ data } = await axios.get(getSubscribedPath));
        console.log('[getDefaultSources][]data', data.length);
    } catch (e) {
        console.warn("[getDefaultSources][getDefaultSources]", e);
    }
    try {
        await getSourcesIndex({
            sources: data,
            setAllReceivedSourcesNumber, setCurrentAlreadySetSourcesNumber,
            addTempPostArr, setAddTempSourceItem,


            dispatch,
            sourceActions,
            postActions
        });
    } catch (e) {
        console.warn("[getDefaultSources][getDefaultSources][getDefaultSources]", e);
    }
};

export {
    getDefaultSources,
    getSourcesIndex
}
