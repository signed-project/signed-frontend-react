import { call, select, put, takeEvery } from "redux-saga/effects";
import { publicApi, userApi } from "../../../config/http.config";
import { ACTIONS as POST_ACTIONS } from "../../storage/post";
import { ACTIONS as USER_ACTIONS } from "../../storage/user";
import { ACTIONS as SOURCE_ACTIONS } from "../../storage/source";
import { getCashData } from "./_aggregationIndex";
import { parseJson } from '../../../libs/json';
import axios from "axios";
import jwt from 'jsonwebtoken';
import { User } from '../../models/user';


const publicApiHost = process.env.REACT_APP_PUBLIC_API_HOST;
const apiHost = process.env.REACT_APP_API_HOST;

const getMyIndex = async (address) => {
  try {
    let res = await axios.get(`${publicApiHost}${publicApi.GET_INDEX}/${address}`);
    // let res = await axios.post('https://699m468ak3.execute-api.us-west-2.amazonaws.com/post');
    return {
      myPosts: res.data.posts,
      mySource: res.data.source
    };
  } catch (error) {
    console.warn("[getMyIndex][error]", error);
    return []
  }
};


// TODO rename
const getSubscribedIndex = async ({ subscribed }) => {
  let postSubscribed = [], gatheredPosts = [], hostSources = [];
  try {
    await Promise.all(subscribed.map(async (sbs) => {
      try {
        let res = await axios.get(`${sbs.url}`);
        if (res?.data?.posts) {
          postSubscribed.push(res?.data?.posts);
        }
        if (res?.data?.source) {
          hostSources.push(res?.data?.source);
        }
      } catch (e) {
        console.warn("[getSubscribedIndex][postSubscribed.push]", e);
      }
    }));
  } catch (e) {
    console.warn("[getSubscribedIndex][Promise.all]", e);
  }

  try {
    postSubscribed.map(posts => {
      gatheredPosts = [...gatheredPosts, ...posts]
      return posts;
    })
  }
  catch (e) {
    console.warn("[getSubscribedIndex][gatheredPosts]", e);
  }

  return { gatheredPosts, hostSources };
};

const getAllHostsIndex = async () => {
  let data;
  try {
    ({ data } = await axios.get(`${apiHost}${userApi.SUBSCRIBED}`));
  } catch (e) {
    console.warn("[getIndexSaga][getAllHostsIndex]", e);
  }

  try {
    const { gatheredPosts, hostSources } = await getSubscribedIndex({ subscribed: data });
    return { gatheredPosts, hostSources };
  } catch (e) {
    console.warn("[getIndexSaga][getAllHostsIndex][getSubscribedIndex]", e);
    return []
  }
};

const getUser = async ({ axios, token }) => {
  let res;
  try {
    const data = {
      token
    };
    res = await axios.post(userApi.GET_USER, data);
  } catch (error) {
    console.warn("[getUserInfo][error]", error);
    return res;
  }
  return res;
};


function* workerGetIndex(action) {
  const { isRegistered } = action.payload;
  let gatheredPosts = [], arrPosts, arrSources, myPosts,
    userSubscribedSources, hostSources, mySource, user;
  const accessToken = sessionStorage.getItem("accessToken");
  const wif = sessionStorage.getItem("wif");
  const accessTokenDecoded = jwt.decode(accessToken);
  const axios = yield select((state) => state.axios.axios);
  user = yield select((state) => state.user);

  if (!isRegistered) {
    if (wif && accessToken && accessTokenDecoded.exp * 1000 > new Date().getTime()) {
      const resUserData = yield call(getUser, { axios: axios, token: accessToken });

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
          }
        };
        userModel.setUserData = userObject;
        user = userModel.newUser;
        yield put({ type: USER_ACTIONS.SET_USER, payload: user });
      }
    }
  }

  if (user.isAuth) {
    try {
      userSubscribedSources = user.subscribed.map(sub => {
        return parseJson(sub.source);
      });
    } catch (e) {
      console.warn('[getIndexSaga][data.subscribed.map]', e);
    }

    try {
      ({ myPosts, mySource } = yield call(getMyIndex, user.source.address));
    }
    catch (e) {
      myPosts = [];
      console.warn("[workerGetIndex][getMyIndex]", e);
    }
    try {
      if (Array.isArray(user.subscribed)) {
        ({ gatheredPosts, hostSources } = yield call(getSubscribedIndex, { subscribed: user.subscribed }));
      }
    } catch (e) {
      console.warn("[workerGetIndex][getSubscribed]", e);
    }

    try {
      arrSources = [...userSubscribedSources, ...hostSources, mySource];
      arrPosts = [...myPosts, ...gatheredPosts];
    } catch (e) {
      console.warn('[getIndexSaga][Destructuring myPost, hostPost, hostsSources]', e)
    }

  } else {
    try {
      const { gatheredPosts, hostSources } = yield call(getAllHostsIndex);
      arrPosts = gatheredPosts;
      arrSources = hostSources;
    } catch (e) {
      arrPosts = [];
      console.warn('[getIndexSaga][getAllHostsIndex]', e)
    }
  }

  if (!arrPosts) { return }
  const index = yield call(getCashData, { arrPosts, arrSources });
  yield put({ type: POST_ACTIONS.SET_POST_STREAM, payload: index.stream });
  yield put({ type: POST_ACTIONS.SET_POST_HASH, payload: index.hashedPost });
  yield put({ type: POST_ACTIONS.SET_POST_LATEST, payload: index.latestPost });
  yield put({
    type: SOURCE_ACTIONS.SET_SOURCE_LATEST,
    payload: index.latestSource,
  });
  yield put({
    type: SOURCE_ACTIONS.SET_SOURCE_HASH,
    payload: index.latestSource,
  });
}


function* watchGetIndex() {
  yield takeEvery(POST_ACTIONS.GET_INDEX, workerGetIndex);
}

export default watchGetIndex;
