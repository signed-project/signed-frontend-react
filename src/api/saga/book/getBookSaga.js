import { call, select, put } from "redux-saga/effects";
import { publicApi, userApi } from "../../../config/http.config";
import { ACTIONS as POST_ACTIONS } from "../../storage/post";
import { ACTIONS as USER_ACTIONS } from "../../storage/user";
import { ACTIONS as SOURCE_ACTIONS } from "../../storage/source";
import { getCashData } from "./_aggregationBook";
import { parseJson } from '../../../libs/json';
import axios from "axios";
import jwt from 'jsonwebtoken';
import { User } from '../../models/user';


const publicApiHost = process.env.REACT_APP_PUBLIC_API_HOST;
const apiHost = process.env.REACT_APP_API_HOST;

const getMyBook = async (address) => {
  try {
    let res = await axios.get(`${publicApiHost}${publicApi.GET_INDEX}/${address}`);
    // let res = await axios.post('https://699m468ak3.execute-api.us-west-2.amazonaws.com/post');
    return {
      myPosts: res.data.posts,
      mySource: res.data.source
    };
  } catch (error) {
    console.log("[getMyBook][error]", error);
    return []
  }
};



// TODO rename
const getSubscribedBook = async ({ subscribed }) => {
  let postSubscribed = [], gatheredPosts = [], hostSources = [];
  try {
    await Promise.all(subscribed.map(async (sbs) => {
      try {
        let res = await axios.get(`${sbs.url}`);
        if (res?.data?.posts) {
          postSubscribed.push(res?.data?.posts);
        }
        if (res?.data?.source) {
          console.log('res?.data?.source', res?.data?.source);
          hostSources.push(res?.data?.source);
        }
      } catch (e) {
        console.warn("[getSubscribedBook][postSubscribed.push]", e);
      }
    }));
  } catch (e) {
    console.warn("[getSubscribedBook][Promise.all]", e);
  }

  try {
    postSubscribed.map(posts => {
      gatheredPosts = [...gatheredPosts, ...posts]
      return posts;
    })
  }
  catch (e) {
    console.warn("[getHostsBook][gatheredPosts]", e);
  }

  return { gatheredPosts, hostSources };
};

const getAllHostsBook = async () => {
  let data;
  try {
    ({ data } = await axios.get(`${apiHost}${userApi.SUBSCRIBED}`));
  } catch (e) {
    console.warn("[getBookSaga][getAllHostsBook]", e);
  }

  try {
    const { gatheredPosts } = await getSubscribedBook({ subscribed: data });
    return gatheredPosts;
  } catch (e) {
    console.warn("[getBookSaga][getAllHostsBook][getSubscribedBook]", e);
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
    console.log("[getUserInfo][error]", error);
    return res;
  }
  return res;
};

// function* workerGetBook(action) {
export default function* watchGetBook() {
  let userExist = false;
  const accessToken = sessionStorage.getItem("accessToken");
  const wif = sessionStorage.getItem("wif");
  const accessTokenDecoded = jwt.decode(accessToken);
  const axios = yield select((state) => state.axios.axios);
  let gatheredPosts = [], arrPosts, arrSources, myPosts, userSubscribedSources, hostSources;
  if (wif && accessToken && accessTokenDecoded.exp * 1000 > new Date().getTime()) {
    const resData = yield call(getUser, { axios: axios, token: accessToken });
    if (resData) {
      const { data } = resData;
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
      const user = userModel.newUser;
      yield put({ type: USER_ACTIONS.SET_USER, payload: user });

      try {
        userSubscribedSources = data.subscribed.map(sub => {
          return parseJson(sub.source);
        });
      } catch (e) {
        console.warn('[getBookSaga][data.subscribed.map]', e);
      }


      try {
        ({ myPosts } = yield call(getMyBook, data.address));
      }
      catch (e) {
        myPosts = [];
        console.warn("[workerGetBook][getMyBook]", e);
      }
      try {
        if (Array.isArray(data.subscribed)) {
          ({ gatheredPosts, hostSources } = yield call(getSubscribedBook, { subscribed: data.subscribed }));
        }
      } catch (e) {
        console.warn("[workerGetBook][getSubscribedBook]", e);
      }

      try {
        arrSources = [...userSubscribedSources, ...hostSources];
        arrPosts = [...myPosts, ...gatheredPosts];
      } catch (e) {
        console.warn('[getBookSaga][Destructuring myPost, hostPost, hostsSources]', e)
      }
      userExist = true;
    }
  }
  if (!userExist) {
    try {
      arrPosts = yield call(getAllHostsBook);
    } catch (e) {
      console.warn('[getBookSaga][getAllHosts]', e)
      arrPosts = [];
    }
  }


  if (!arrPosts) { return }
  const book = yield call(getCashData, { arrPosts, arrSources });
  yield put({ type: POST_ACTIONS.SET_POST_STREAM, payload: book.stream });
  yield put({ type: POST_ACTIONS.SET_POST_HASH, payload: book.hashedPost });
  yield put({ type: POST_ACTIONS.SET_POST_LATEST, payload: book.latestPost });
  yield put({
    type: SOURCE_ACTIONS.SET_SOURCE_LATEST,
    payload: book.latestSource,
  });
  yield put({
    type: SOURCE_ACTIONS.SET_SOURCE_HASH,
    payload: book.latestSource,
  });
}
// export default function* watchGetBook() {
//   yield takeEvery(POST_ACTIONS.GET_BOOK, workerGetBook);
// }


