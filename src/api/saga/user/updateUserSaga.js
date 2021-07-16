import { takeEvery, call, select, put } from "redux-saga/effects";
import { userApi } from "../../../config/http.config";
import { ACTIONS as ACTIONS_USER } from "../../storage/user";


const sendUserData = async ({ axios, source }) => {
    try {
        let res = await axios.post(userApi.UPDATE_USER, { source });
        return res;
    } catch (error) {
        console.log("[updateUserSaga][sendUserData]", error);
    }
};

export function* workerUpdateUser(action) {
    // yield put({ type: ACTIONS_USER.SET_LOADING, payload: true });
    console.log(' yield put({ type: ACTIONS_USER.SET_LOADING, payload: true });');
    console.log(' yield put({ type: ACTIONS_USER.SET_LOADING, payload: true });');
    console.log(' yield put({ type: ACTIONS_USER.SET_LOADING, payload: true });');
    let user;
    const axios = yield select((state) => state.axios.axios);

    const userResponse = yield call(sendUserData, { axios, source: action.payload.source });

    // what is get as result
    if (userResponse?.data) {
        yield put({ type: ACTIONS_USER.SET_USER, payload: action.payload });
    }
    yield put({ type: ACTIONS_USER.SET_LOADING, payload: false });
}

export default function* watchUpdateUser() {
    yield takeEvery(ACTIONS_USER.UPDATE_USER, workerUpdateUser);
}
