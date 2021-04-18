import { takeEvery, call, put, select } from 'redux-saga/effects';
import { postApi } from '../../../config/http.config';
import { ACTIONS as POST_ACTIONS } from '../../storage/post';
import { post as postsDummy, sources as sourcesDummy } from '../../../dummyData';
import { stringify, parseJson } from '../../../libs/json';
import { getCashData } from './aggregationPost';


const getMyPosts = async (axios) => {
    try {
        let res = await axios.get(postApi.GET_POST);
        return res.data.posts;
    } catch (error) {
        console.log("[getUserInfo][error]", error);
    }
};


export function* workerLogin(action) {
    console.log('workerLogin');
}

export default function* watchGetBook() {
    const axios = yield select((state) => state.axios.axios);
    const hosts = '';
    let hostsPost;
    const myPosts = yield call(getMyPosts, axios);

    if (hosts) {
        hostsPost = yield call(getMyPosts, axios);
    }
    else {
        hostsPost = parseJson(stringify(postsDummy.posts));
    }

    hostsPost = Array.isArray(hostsPost) ? hostsPost : [hostsPost];
    const arrPosts = [...myPosts, ...hostsPost];


    const bookData = getCashData(arrPosts)

    // yield put({ type: POST_ACTIONS.SET_POST_STREAM, payload: dummyStreamPosts });
}


// while (true) {
//         try {
//             yield take('setAxios',);
//         } catch (err) {
//             console.error(err);
//         }
//     }

// yield takeEvery(ACTIONS.TEST, workerLogin);