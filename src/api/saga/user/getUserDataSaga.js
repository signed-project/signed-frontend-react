

import { takeEvery, call, select, put } from "redux-saga/effects";
import { userApi } from "../../../config/http.config";
import { ACTIONS } from "../../storage/user";

const getTokenPair = async (axios, token) => {
    try {
        const data = {
            token
        };
        let res = await axios.post(userApi.GET_TOKEN_PAIR, data);
        return res;
    } catch (error) {
        console.log("[getTokenPair][error]", error);
    }
};
const getUser = async (axios, token) => {
    try {
        const data = {
            token
        };
        let res = await axios.post(userApi.GET_USER_BY_TOKEN, data);
        return res;
    } catch (error) {
        console.log("[getUserInfo][error]", error);
    }
};

export function* workerGetUserData(action) {
    const axios = yield select((state) => state.axios.axios);
    const { data } = yield call(getUser, axios, action.payload);
    if (data) {
        const userData = {
            isAuth: true,
            source: {
                address: data.address,
                name: data.login,
                updatedAt: data.updatedAt,
                avatar: {
                    contentType: "image/jpeg",
                    hash: "f433c21fe3c6c7475f7be0017294547e93d7fcd44617f62bf7f369a13b48e764"
                },
                hosts: [{
                    fileStores: ['jdjjdj'],
                    index: "url"
                }],
                signatures: 'fjdjd343243jkdfjdk343',
                hash: 'fjdjd343243jkdfjdk343',
            },
            wfi: data.wif,
        };
        yield put({ type: ACTIONS.SET_USER, payload: userData });
    }


}
export function* workerGetPairToken(action) {
    const axios = yield select((state) => state.axios.axios);
    const { data } = yield call(getTokenPair, axios, action.payload);
    const userData = {
        isAuth: true,
        source: {
            address: data.address,
            name: data.login,
            updatedAt: data.updatedAt,
            avatar: {
                contentType: "image/jpeg",
                hash: "f433c21fe3c6c7475f7be0017294547e93d7fcd44617f62bf7f369a13b48e764"
            },
            hosts: [{
                fileStores: ['jdjjdj'],
                index: "url"
            }],
            signatures: 'fjdjd343243jkdfjdk343',
            hash: 'fjdjd343243jkdfjdk343',
        },
        wfi: data.wif,
    };
    yield put({ type: ACTIONS.SET_USER, payload: userData });

}

export default function* watchGetUserData() {
    yield takeEvery(ACTIONS.GET_USER_DATA_BY_TOKEN, workerGetUserData);
    yield takeEvery(ACTIONS.GET_PAIRS_TOKEN, workerGetPairToken);
}
