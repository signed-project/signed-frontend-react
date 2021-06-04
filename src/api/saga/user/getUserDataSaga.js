

import { takeEvery, call, select, put } from "redux-saga/effects";
import { userApi } from "../../../config/http.config";
import { ACTIONS } from "../../storage/user";
import { User } from '../../models/user';


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
    let res;
    try {
        const data = {
            token
        };
        res = await axios.post(userApi.GET_USER_BY_TOKEN, data);
        return res;
    } catch (error) {
        console.log("[getUserInfo][error]", error);
        return res;
    }
};

export function* workerGetUserData(action) {
    const axios = yield select((state) => state.axios.axios);
    const resData = yield call(getUser, axios, action.payload.accessToken);
    if (resData) {
        const { data } = resData;
        const userModel = new User({
            isAuth: true,
            address: data.address,
            name: data.name,
            wif: action.payload.wif
        })
        const user = userModel.newUser;
        yield put({ type: ACTIONS.SET_USER, payload: user });
    }

}

export default function* watchGetUserData() {
    yield takeEvery(ACTIONS.GET_USER_DATA_BY_TOKEN, workerGetUserData);
}
