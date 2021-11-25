import { takeEvery, call, select, put, delay } from "redux-saga/effects";
import { postApi } from "../../../config/http.config";
import { ACTIONS } from "../../storage/post";
import { ACTIONS as ACTIONS_USER } from "../../storage/user";

import {
  addPostToStream,
  getStreamPage,
} from "./../../customNpmPackage/signedLoader";

const sendPosts = async ({ axios, data }) => {
  try {
    let res = await axios.post(postApi.SEND_POST, data);
    return res;
  } catch (error) {
    console.warn("[publish][sendPosts]", error);
  }
};

const sendMentions = async ({ address, hosts, post, axios }) => {
  const result = await Promise.any(
    hosts.map(async (host) => {
      try {
        return await axios.post(host.inbox, {
          post,
          mentionedUserAddress: address,
        });
      } catch (e) {
        console.warn("[publishPostSaga][sendMentions]", e);
      }
    })
  );
};

const mapMentions = async ({ axios, post }) => {
  if (!Array.isArray(post.mentions)) {
    return;
  }
  const resultMapMention = await Promise.allSettled(
    post.mentions.map(async (source) => {
      try {
        return await sendMentions({
          address: source.address,
          hosts: source.hosts,
          post,
          axios,
        });
      } catch (e) {
        console.warn("[NewPost][attachments]", e);
      }
    })
  );
};

export function* workerSendPost(action) {
  const { post, tags } = action.payload;

  yield put({ type: ACTIONS_USER.SET_LOADING, payload: true });

  const axios = yield select((state) => state.axios.axios);
  const subscribedSources = yield select((state) => state.source.subscribed);
  const {
    isAuth,
    subscribed,
    source: userSource,
  } = yield select((state) => state.user);
  yield call(sendPosts, { axios, data: { post, tags, addToIndex: true } });

  if (post?.mentions) {
    yield call(mapMentions, { axios, post });
  }

  let sources = [];

  if (!isAuth) {
    sources = subscribedSources.slice();
  } else {
    sources = [...subscribed, { ...userSource }];
  }

  const { lengthOfUserRootPosts, lengthOfInternalRootPosts, stream } =
    addPostToStream({ post, sources });

  yield put({ type: ACTIONS.SET_POST_STREAM, payload: stream });
  yield put({
    type: ACTIONS.SET_ALREADY_LOADED_POSTS,
    payload: lengthOfUserRootPosts,
  });
  yield put({
    type: ACTIONS.SET_LOADED_POSTS,
    payload: lengthOfInternalRootPosts,
  });

  yield put({ type: ACTIONS_USER.SET_LOADING, payload: false });
}

export default function* watchSendPost() {
  yield takeEvery(ACTIONS.SEND_POST, workerSendPost);
}
