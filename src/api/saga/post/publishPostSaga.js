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


const sendMentions = async ({ address, hosts, post, axios }) => {
  const result = await Promise.any(
    hosts.map(async (host) => {
      try {
        return await axios.post(host.inbox, { post, mentionedUserAddress: address } );
      } catch (e) {
        console.warn("[publishPostSaga][sendMentions]", e);
      }

    }));
}


const mapMentions = async ({ axios, post }) => {
  if (!Array.isArray(post.mentions)) {
    return
  }
  const resultMapMention = await Promise.allSettled(
    post.mentions.map(async (source) => {
      try {
        return await sendMentions({ address: source.address, hosts: source.hosts, post, axios });
      } catch (e) {
        console.warn("[NewPost][attachments]", e);
      }
    }));

  console.log('mapMentions!!!!!!!!!!!!!!!!!!!!', resultMapMention);
}


export function* workerSendPost(action) {
  yield put({ type: ACTIONS_USER.SET_LOADING, payload: true });

  const axios = yield select((state) => state.axios.axios);
  yield call(sendPosts, axios, action.payload);

  if (action.payload.mentions) {
    console.log("action====================[saga]", action.payload);
    yield call(mapMentions, { axios, post: action.payload });
  }

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
