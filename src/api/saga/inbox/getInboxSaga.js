import { call, select, put, takeEvery, throttle, delay } from "redux-saga/effects";
import { inboxApi } from "../../../config/http.config";
import { ACTIONS as INBOX_ACTIONS } from "../../storage/inbox";
import { parseJson } from '../../../libs/json';


const getInbox = async ({ axios, address }) => {
    try {
        const params = {
            address,
        };
        return await axios.get(inboxApi.INBOX, { params });

    } catch (error) {
        console.warn("[getInboxSaga][getInbox]", error);
        return []
    }
}


function* callSelfOnTimer({ axios, address }) {
    let notificationsList;
    const { data } = yield call(getInbox, { axios: axios, address: address });

    console.log('data-----------data', data);

    if (!Array.isArray(data)) return;
    try {
        notificationsList = data.map(notification => {
            notification.post = parseJson(notification.postJson);
            return notification;
        });
    } catch (error) {
        console.warn("[getInboxSaga][callSelfOnTimer]", error);
    }

    notificationsList = notificationsList.sort((a, b) => b.post.createdAt - a.post.createdAt)
    yield put({ type: INBOX_ACTIONS.SET_INBOX, payload: notificationsList });
    if (address) {
        yield delay(2000000);
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
    // yield takeEvery(INBOX_ACTIONS.GET_INBOX, workerGetInbox);
}


export default watchGetInbox;
