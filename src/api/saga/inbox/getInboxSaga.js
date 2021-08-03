import { call, select, put, takeEvery, throttle, delay } from "redux-saga/effects";
import { publicApi, userApi, inboxApi } from "../../../config/http.config";


import { ACTIONS as INBOX_ACTIONS } from "../../storage/inbox";
import { parseJson } from '../../../libs/json';
import axios from "axios";

import { User } from '../../models/user';

const publicApiHost = process.env.REACT_APP_PUBLIC_API_HOST;
const apiHost = process.env.REACT_APP_API_HOST;

const getInbox = async ({ axios, address }) => {
    try {
        const params = {
            address,
        };
        return await axios.get(inboxApi.INBOX, { params });

    } catch (error) {
        console.log("[getUserInfo][error]", error);
        return []
    }
}


function* callSelfOnTimer({ axios, address }) {
    const { data } = yield call(getInbox, { axios: axios, address: address });
    yield put({ type: INBOX_ACTIONS.SET_INBOX, payload: data });
    if (address) {
        yield delay(2000);
        yield call(callSelfOnTimer, { axios, address });
    }
}

function* workerGetInbox() {
    const axios = yield select((state) => state.axios.axios);
    const user = yield select((state) => state.user)
    // const inbox = yield call(setInterval, () => getInbox({ axios: axios, address: user.source.address }), 10000);

    const runner = yield call(callSelfOnTimer, { axios: axios, address: user.source.address });
}

function* watchGetInbox() {
    yield takeEvery(INBOX_ACTIONS.GET_INBOX, workerGetInbox);
}


export default watchGetInbox;
