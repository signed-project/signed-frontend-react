import { takeEvery, call, select, put } from 'redux-saga/effects';
import { postApi } from '../../../config/http.config';
import { ACTIONS } from '../../storage/post';


const sendPosts = async (axios, post) => {
    try {
        let res = await axios.get(postApi.SEND_POST, post);
        return res;
    } catch (error) {
        console.log("[getUserInfo][error]", error);
    }
};


export function* workerSendPost(action) {
    console.log('postActions', action);
    console.log('postActions');
    console.log('postActions');
    const axios = yield select((state) => state.axios.axios);
    const posts = yield call(sendPosts, axios, action);
    yield put({ type: ACTIONS.ADD_POST_TO_STREAM, payload: action });
}

export default function* watchSendPost() {
    yield takeEvery(ACTIONS.SEND_POST, workerSendPost);
}
