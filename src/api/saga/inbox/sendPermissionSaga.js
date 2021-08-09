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
        console.warn("[getUserInfo][error]", error);
        return []
    }
}


const sendPermission = async ({ axios, address, id, status }) => {
    let data;
    const requestData = {
        address: address,
        id: id,
        status: status
    }

    try {
        ({ data } = await axios.post(inboxApi.INBOX_UPDATE_STATE, requestData));
    }
    catch (e) {
        console.warn("[watchSendPermissionDecision][sendPermission]", e);
    }
    return data;
}

function* workerSendPermissionDecision(action) {
    const { address, id, status } = action.payload;
    const axios = yield select((state) => state.axios.axios);
    const resPermission = yield call(sendPermission, { axios: axios, address, id, status });
    if (resPermission) {
        yield put({ type: INBOX_ACTIONS.UPDATE_INBOX_STATUS, payload: { id, status } });
    }
}

function* watchSendPermissionDecision() {
    yield takeEvery(INBOX_ACTIONS.SEND_PERMISSION_DECISION, workerSendPermissionDecision);
}


export default watchSendPermissionDecision;
