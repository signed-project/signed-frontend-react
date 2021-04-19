import { takeEvery, call, put, select } from 'redux-saga/effects';
import { bookApi } from '../../../config/http.config';
import { ACTIONS as POST_ACTIONS } from '../../storage/post';
import { ACTIONS as SOURCE_ACTIONS } from '../../storage/source';
import { dummyBook } from '../../../dummyData/dummyIndex';
import { stringify, parseJson } from '../../../libs/json';
import { getCashData } from './_aggregationBook';


const getMyBook = async (axios) => {
    try {
        let res = await axios.get(bookApi.GET_BOOK);
        return res.data.posts;
    } catch (error) {
        console.log("[getMyBook][error]", error);
    }
};

export function* workerLogin(action) {

    console.log('workerLogin');
}

export default function* watchGetBook() {
    const axios = yield select((state) => state.axios.axios);
    const hosts = '';
    let hostsPost;
    // TODO: change myPost to book.post
    const myPosts = yield call(getMyBook, axios);
    const incomingBook = {
        post: [],
        source: []
    }
    if (hosts) {
        hostsPost = yield call(getMyBook, axios);
    }
    else {
        hostsPost = parseJson(stringify(dummyBook.posts));
    }
    const hostsSources = parseJson(stringify(dummyBook.source));

    hostsPost = Array.isArray(hostsPost) ? hostsPost : [hostsPost];
    const arrPosts = [...myPosts, ...hostsPost];
    const arrSources = [...hostsSources];

    const bookData = yield call(getCashData, arrPosts, arrSources);
    console.log('++++++++++++++++++bookData++++++++++++++++++', bookData);

    if (bookData) {
        yield put({ type: POST_ACTIONS.SET_POST_STREAM, payload: bookData.stream });
        yield put({ type: POST_ACTIONS.SET_POST_HASH, payload: bookData.hashedPost });
        yield put({ type: POST_ACTIONS.SET_POST_LATEST, payload: bookData.latestPost });

        yield put({ type: SOURCE_ACTIONS.SET_SOURCE_LATEST, payload: bookData.latestSource });
        yield put({ type: SOURCE_ACTIONS.SET_SOURCE_HASH, payload: bookData.hashedSource });
    }
}


// while (true) {
//         try {
//             yield take('setAxios',);
//         } catch (err) {
//             console.error(err);
//         }
//     }

// yield takeEvery(ACTIONS.TEST, workerLogin);