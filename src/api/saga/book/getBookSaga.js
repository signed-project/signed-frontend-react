import { takeEvery, call, put, select } from 'redux-saga/effects';
import { postApi } from '../../../config/http.config';
import { ACTIONS as POST_ACTIONS } from '../../storage/post';
import { post as postsDummy, sources as sourcesDummy } from '../../../dummyData';
import { stringify, parseJson } from '../../../libs/json';



const getPosts = async (axios) => {
    try {
        let res = await axios.get(postApi.GET_POST);
        return res;
    } catch (error) {
        console.log("[getUserInfo][error]", error);
    }
};


export function* workerLogin(action) {
    console.log('workerLogin');
}

export default function* watchGetBook() {
    const axios = yield select((state) => state.axios.axios);
    // TODO: add initial host

    console.log(' TODO: add initial host');
    const hostData = '';
    if (hostData) {
        const posts = yield call(getPosts, axios);
    }
    else {
        const dummyStreamPosts = parseJson(stringify(postsDummy.posts));
        console.log('dummyStreamPosts', dummyStreamPosts);
        console.log('postsDummy.posts', postsDummy.posts);
        yield put({ type: POST_ACTIONS.SET_POST_STREAM, payload: dummyStreamPosts });
    }


    // while (true) {
    //     try {
    //         yield take('setAxios', workerLogin);

    //     } catch (err) {
    //         console.error(err);
    //     }
    // }

    // yield takeEvery(ACTIONS.TEST, workerLogin);
}


// while (true) {
//         try {
//             yield take('setAxios',);
//         } catch (err) {
//             console.error(err);
//         }
//     }