import { takeEvery, call, select, put } from "redux-saga/effects";
import { postApi } from "../../../config/http.config";
import { ACTIONS } from "../../storage/post";
import axios from "axios";
const sendPosts = async (axiosInst, post) => {
  try {
    const data = {
      post: post,
      addToIndex: true,
    };
    console.log('axiosInst', axiosInst);
    console.log('axios', axios);
    // let res = await axios.post(postApi.SEND_POST, data);
    let res = await axiosInst.post(postApi.SEND_POST, data);
    return res;
  } catch (error) {
    console.log("[getUserInfo][error]", error);
  }
};

export function* workerSendPost(action) {
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
  yield takeEvery(ACTIONS.SEND_POST, workerSendPost);
}
