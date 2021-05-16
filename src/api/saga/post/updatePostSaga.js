import { takeEvery, call, select, put } from "redux-saga/effects";
import { bookApi } from "../../../config/http.config";
import { ACTIONS } from "../../storage/post";

const sendPosts = async (axios, post) => {
  try {
    const data = {
      post: post,
      addToIndex: true,
    };
    let res = await axios.post(bookApi.SEND_POST, data);
    return res;
  } catch (error) {
    console.log("[getUserInfo][error]", error);
  }
};

export function* workerUpdatePost(action) {
  console.log("action====================[saga]", action);

  const axios = yield select((state) => state.axios.axios);
  yield call(sendPosts, axios, action.payload);

  yield put({ type: ACTIONS.ADD_POST_TO_HASH, payload: action.payload });
  yield put({ type: ACTIONS.ADD_POST_TO_LATEST, payload: action.payload });
  if (action.payload.type !== "reply") {
    yield put({ type: ACTIONS.ADD_POST_TO_STREAM, payload: action.payload });
  }
}

export default function* watchSendPost() {
  yield takeEvery(ACTIONS.UPDATE_POST, workerUpdatePost);
}
