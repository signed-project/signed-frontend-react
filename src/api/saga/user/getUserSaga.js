import { takeEvery, call, select, put } from "redux-saga/effects";
import { userApi } from "../../../config/http.config";
import { ACTIONS as ACTIONS_USER } from "../../storage/user";
import { ACTIONS as ACTIONS_POST } from "../../storage/post";
import { User } from '../../models/user';
import { parseJson } from '../../../libs/json';

const getUser = async (axios, token) => {
    let res;
    try {
        const data = {
            token
        };
        res = await axios.post(userApi.GET_USER, data);
    } catch (error) {
        console.warn("[getUserInfo][error]", error);
    }
    return res;
};

export function* workerGetUserData(action) {
    const axios = yield select((state) => state.axios.axios);
    const { accessToken, wif, history } = action.payload;
    const resData = yield call(getUser, axios, accessToken);
    if (resData) {
        const { data } = resData;
        const source = parseJson(data.source);
        const userModel = new User({});
        const userObject = {
            isAuth: true,
            wif: wif,
            subscribed: data.subscribed,
            source: {
                ...source,
            }
        };
        userModel.setUserData = userObject;
        const user = userModel.newUser;
        yield put({ type: ACTIONS_USER.SET_USER, payload: user });
        yield put({ type: ACTIONS_POST.GET_INDEX, payload: { isRegistered: true, history } });
    }
}

export default function* watchGetUserData() {
    yield takeEvery(ACTIONS_USER.GET_USER, workerGetUserData);
}
