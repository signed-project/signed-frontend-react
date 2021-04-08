import { takeEvery, call, select } from 'redux-saga/effects';
import { postApi } from '../../../config/http.config';



const sendPosts = async (axios) => {
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

export default function* watchSend() {
    const axios = yield select((state) => state.axios.axios);

    const posts = yield call(sendPosts, axios);

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