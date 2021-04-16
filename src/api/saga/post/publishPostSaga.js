import { takeEvery, call, select, put } from 'redux-saga/effects';
import { postApi } from '../../../config/http.config';
import { ACTIONS } from '../../storage/post';


const sendPosts = async (axios, post) => {
    try {
        console.log('post________saga!!!!!!!!!!!!!!!!', post);
        const data = {
            post: post,
            addToIndex: true
        };
        let res = await axios.post(postApi.SEND_POST, data);
        return res;
    } catch (error) {
        console.log("[getUserInfo][error]", error);
    }
};


export function* workerSendPost(action) {
    console.log('postActions', action);

    const axios = yield select((state) => state.axios.axios);
    const posts = yield call(sendPosts, axios, action.payload);
    console.log('___________________action.payload___________________', action.payload);
    yield put({ type: ACTIONS.ADD_POST_TO_STREAM, payload: action.payload });
}

export default function* watchSendPost() {
    yield takeEvery(ACTIONS.SEND_POST, workerSendPost);
}
