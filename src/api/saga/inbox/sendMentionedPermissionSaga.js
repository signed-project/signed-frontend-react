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

const sendPermission = async ({ axios, address, id, status, destinationAddress, authorAddress }) => {
    let data;
    const requestData = {
        address,
        id,
        status,
        destinationAddress,
        authorAddress
    }

    try {
        ({ data } = await axios.post(inboxApi.INBOX_UPDATE_STATE, requestData));
    }
    catch (e) {
        console.warn("[watchSendPermissionDecision][sendPermission]", e);
    }
    return data;
}

function* workerSendMentionedPermission(action) {
    const { address, id, status, destinationAddress, authorAddress } = action.payload;
    const axios = yield select((state) => state.axios.axios);
    const resPermission = yield call(sendPermission, { axios: axios, address, id, status, destinationAddress, authorAddress });
    if (resPermission) {
        yield put({ type: INBOX_ACTIONS.UPDATE_INBOX_STATUS, payload: { id, status } });
    }
}

function* watchSendMentionedPermission() {
    yield takeEvery(INBOX_ACTIONS.SEND_PERMISSION_DECISION, workerSendMentionedPermission);
}


export default watchSendMentionedPermission;
