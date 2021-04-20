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
    if (hosts) {
        hostsPost = yield call(getMyBook, axios);
    }
    else {
        // hostsPost = parseJson(stringify(dummyBook.posts));
        hostsPost = dummyBook.posts;
    }
    const hostsSources = dummyBook.source;

    hostsPost = Array.isArray(hostsPost) ? hostsPost : [hostsPost];
    const arrPosts = [...myPosts, ...hostsPost];
    const arrSources = [...hostsSources];

    const book = yield call(getCashData, arrPosts, arrSources);

    yield put({ type: POST_ACTIONS.SET_POST_STREAM, payload: book.stream });
    yield put({ type: POST_ACTIONS.SET_POST_HASH, payload: book.hashedPost });
    yield put({ type: POST_ACTIONS.SET_POST_LATEST, payload: book.latestPost });
    yield put({ type: SOURCE_ACTIONS.SET_SOURCE_LATEST, payload: book.latestSource });
    yield put({ type: SOURCE_ACTIONS.SET_SOURCE_HASH, payload: book.latestSource });
}


// while (true) {
//         try {
//             yield take('setAxios',);
//         } catch (err) {
//             console.error(err);
//         }
//     }

// yield takeEvery(ACTIONS.TEST, workerLogin);