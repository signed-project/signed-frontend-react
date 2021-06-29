import { takeEvery, call, select, put } from "redux-saga/effects";
import { userApi } from "../../../config/http.config";
import { ACTIONS as ACTIONS_USER } from "../../storage/user";
import { ACTIONS as ACTIONS_POST } from "../../storage/post";
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
        res = await axios.post(userApi.GET_USER, data);
    } catch (error) {
        console.log("[getUserInfo][error]", error);
    }
    return res;
};

export function* workerGetUserData(action) {
    console.log('33333333workerGetUserData33333333');
    const axios = yield select((state) => state.axios.axios);
    const { accessToken, wif, history } = action.payload;
    const resData = yield call(getUser, axios, accessToken);
    if (resData) {
        const { data } = resData;
        const userModel = new User({
            isAuth: true,
            address: data.address,
            name: data.userName,
            wif: wif,
            subscribed: data.subscribed
        });
        const user = userModel.newUser;
        yield put({ type: ACTIONS_USER.SET_USER, payload: user });
        yield put({ type: ACTIONS_POST.GET_BOOK, payload: { isRegistered: true, history } });
    }
}

export default function* watchGetUserData() {
    yield takeEvery(ACTIONS_USER.GET_USER, workerGetUserData);
}
