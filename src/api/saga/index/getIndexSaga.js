import { call, select, put, takeEvery, delay, all } from "redux-saga/effects";
import { publicApi, userApi } from "../../../config/http.config";
import { ACTIONS as POST_ACTIONS } from "../../storage/post";
import { ACTIONS as USER_ACTIONS } from "../../storage/user";
import { ACTIONS as SOURCE_ACTIONS } from "../../storage/source";
// import { getCashData } from "./_aggregationIndex";
import { buildStream } from "../../customNpmPackage/buildStream";
import { parseJson } from "../../../libs/json";
import axios from "axios";
import jwt from "jsonwebtoken";
import { User } from "../../models/user";

const publicApiHost = process.env.REACT_APP_PUBLIC_API_INDEX_HOST;
const apiHost = process.env.REACT_APP_API_HOST;

let postCollecting = [];
let sourceCollecting = [];


// const delay = time => new Promise(resolve => setTimeout(resolve, time));

const getSubscribedIndex = async ({ subscribed }) => {
  let gatheredPosts = [],
    hostSources = [];
  try {
    await Promise.allSettled(
      subscribed.map(async (sbs) => {
        await Promise.allSettled(
          sbs.hosts.map(async (hst) => {
            let res = await axios.get(`${hst.index}`);
            if (res?.data?.index?.recentPosts) {
              const indexPosts = Array.isArray(res?.data?.index?.recentPosts) ? res?.data?.index?.recentPosts : [];
              console.log('indexPosts[000]', indexPosts.length);
              gatheredPosts.push(...indexPosts);
              // postCollecting.push(...indexPosts)
            }
            if (res?.data?.source) {
              hostSources.push(res?.data?.source);
              // sourceCollecting.push(res?.data?.source);
            }
            return;
          })
        );
      })
    );

  } catch (e) {
    console.warn("[getSubscribedIndex][Promise.all]", e);
  }

  return { gatheredPosts, hostSources };
};

const getAllHostsIndex = async () => {
  let data;
  try {
    ({ data } = await axios.get(`${apiHost}${userApi.SUBSCRIBED}`));
    console.log('[getAllHostsIndex][data]', data);
  } catch (e) {
    console.warn("[getIndexSaga][getAllHostsIndex]", e);
  }

  try {
    const { gatheredPosts, hostSources } = await getSubscribedIndex({
      subscribed: data,
    });

    console.log('getAllHostsIndex[gatheredPosts]', gatheredPosts);
    console.log('getAllHostsIndex[hostSources]', hostSources);
    return { gatheredPosts, hostSources };
  } catch (e) {
    console.warn("[getIndexSaga][getAllHostsIndex][getSubscribedIndex]", e);
    return [];
  }
};

const getUser = async ({ axios, token }) => {
  let res;
  try {
    const data = {
      token,
    };
    res = await axios.post(userApi.GET_USER, data);
  } catch (error) {
    console.warn("[getUserInfo][error]", error);
    return res;
  }
  return res;
};


function accessDataFrontStorage() {
  const accessToken = sessionStorage.getItem("accessToken");
  const wif = sessionStorage.getItem("wif");
  const accessTokenDecoded = jwt.decode(accessToken);
  return {
    accessToken,
    wif,
    accessTokenDecoded
  }
};

function* callSelfOnTimer() {
  let { temp: tempSource } = yield select((state) => state.source);
  let { temp: tempPosts } = yield select((state) => state.post);
  let { allReceivedNumber, currentAlreadySetNumber } = yield select((state) => state.source);

  const index = buildStream({ arrPosts: tempPosts, arrSources: tempSource });
  yield put({ type: POST_ACTIONS.SET_POST_STREAM, payload: index.stream });
  yield put({ type: POST_ACTIONS.SET_POST_HASH, payload: index.hashedPost });
  yield put({ type: POST_ACTIONS.SET_POST_LATEST, payload: index.latestPost });
  yield put({ type: POST_ACTIONS.SET_HASHED_TARGET_POST, payload: index.hashedTargetPost });
  yield put({ type: SOURCE_ACTIONS.SET_SOURCE_LATEST, payload: index.latestSource });
  yield put({ type: SOURCE_ACTIONS.SET_SOURCE_HASH, payload: index.latestSource });

  if (currentAlreadySetNumber !== allReceivedNumber) {
    yield delay(5000);
    yield call(callSelfOnTimer);
  }
}

function* workerGetIndex(action) {
  const { isRegistered } = action.payload;
  let user = yield select((state) => state.user);
  const axios = yield select((state) => state.axios.axios);

  const { accessToken, wif, accessTokenDecoded } = accessDataFrontStorage();
  if (!isRegistered) {
    if (
      wif &&
      accessToken &&
      accessTokenDecoded.exp * 1000 > new Date().getTime()
    ) {
      const resUserData = yield call(getUser, {
        axios: axios,
        token: accessToken,
      });

      if (resUserData) {
        const { data } = resUserData;
        const source = parseJson(data.source);
        const userModel = new User({});
        const userObject = {
          isAuth: true,
          wif: wif,
          subscribed: data.subscribed,
          source: {
            ...source,
          },
        };
        userModel.setUserData = userObject;
        user = userModel.newUser;
        yield put({ type: USER_ACTIONS.SET_USER, payload: user });
      }
    }
  }

  yield delay(5000);
  yield call(callSelfOnTimer, { address: true, loadingComplete: 100 });

  // const index = yield call(getCashData, { arrPosts, arrSources });
  // const index = getCashData({ arrPosts, arrSources });
  // console.log('index', index);
  // yield put({ type: POST_ACTIONS.SET_POST_STREAM, payload: index.stream });
  // yield put({ type: POST_ACTIONS.SET_POST_HASH, payload: index.hashedPost });
  // yield put({ type: POST_ACTIONS.SET_POST_LATEST, payload: index.latestPost });
  // yield put({
  //   type: SOURCE_ACTIONS.SET_SOURCE_LATEST,
  //   payload: index.latestSource,
  // });
  // yield put({
  //   type: SOURCE_ACTIONS.SET_SOURCE_HASH,
  //   payload: index.latestSource,
  // });
}

function* watchGetIndex() {
  yield takeEvery(POST_ACTIONS.GET_INDEX, workerGetIndex);
}

export default watchGetIndex;
