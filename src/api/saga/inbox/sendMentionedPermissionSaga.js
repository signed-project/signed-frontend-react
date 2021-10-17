import { call, select, put, takeEvery, throttle, delay } from "redux-saga/effects";
import { publicApi, userApi, inboxApi } from "../../../config/http.config";
import { ACTIONS as INBOX_ACTIONS } from "../../storage/inbox";
import { ACTIONS as POST_ACTIONS } from "../../storage/post";
import { parseJson } from '../../../libs/json';
import axios from "axios";
import { Post } from '../../models/post';





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

const sendPermission = async ({ axios, id, status, destinationAddress, authorAddress, post }) => {
    let data;
    const requestData = {
        id,
        status,
        destinationAddress,
        authorAddress,
        post
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
    const { id, status, destinationAddress, authorAddress, post } = action.payload;
    const axios = yield select((state) => state.axios.axios);
    const { wif } = yield select((state) => state.user);
    const postModel = new Post({ ...post, wif });
    const postWithAddSignature = postModel.addSignature;

    const resPermission = yield call(sendPermission, { axios: axios, id, status, destinationAddress, authorAddress, post: postWithAddSignature });

    if (resPermission) {
        yield put({ type: INBOX_ACTIONS.UPDATE_INBOX_STATUS, payload: { id, status } });
        yield put({ type: POST_ACTIONS.ADD_POST_TO_HASH, payload: post });
        yield put({ type: POST_ACTIONS.ADD_POST_TO_LATEST, payload: post });

        if (action.payload.type !== "reply") {
            yield put({ type: POST_ACTIONS.ADD_POST_TO_STREAM, payload: post });
        }
    }
}

function* watchSendMentionedPermission() {
    yield takeEvery(INBOX_ACTIONS.SEND_PERMISSION_DECISION, workerSendMentionedPermission);
}


export default watchSendMentionedPermission;
