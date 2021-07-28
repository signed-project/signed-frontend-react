import { takeEvery, call, select, put } from "redux-saga/effects";
import { postApi } from "../../../config/http.config";
import { ACTIONS } from "../../storage/post";
import { ACTIONS as ACTIONS_USER } from "../../storage/user";
import axios from "axios";

const sendPosts = async (axiosInst, post) => {
  try {
    const data = {
      post: post,
      addToIndex: true,
    };
    let res = await axiosInst.post(postApi.SEND_POST, data);
    return res;
  } catch (error) {
    console.log("[getUserInfo][error]", error);
  }
};

export function* workerSendPost(action) {
  yield put({ type: ACTIONS_USER.SET_LOADING, payload: true });
  console.log("action====================[saga]", action);

  const axios = yield select((state) => state.axios.axios);
  yield call(sendPosts, axios, action.payload);

  yield put({ type: ACTIONS.ADD_POST_TO_HASH, payload: action.payload });
  yield put({ type: ACTIONS.ADD_POST_TO_LATEST, payload: action.payload });
  if (action.payload.type !== "reply") {
    yield put({ type: ACTIONS.ADD_POST_TO_STREAM, payload: action.payload });
  }
  yield put({ type: ACTIONS_USER.SET_LOADING, payload: false });
}

export default function* watchSendPost() {
  yield takeEvery(ACTIONS.SEND_POST, workerSendPost);
}
