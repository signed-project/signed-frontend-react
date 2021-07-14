import { takeEvery, call, select, put } from "redux-saga/effects";
import { publicApi, userApi } from "../../../config/http.config";
import { ACTIONS as POST_ACTIONS } from "../../storage/post";
import { ACTIONS as USER_ACTIONS } from "../../storage/user";
import { ACTIONS as SOURCE_ACTIONS } from "../../storage/source";
import { dummyBook } from "../../../dummyData/dummyIndex";
import { getCashData } from "./_aggregationBook";
import axios from "axios";
import jwt from 'jsonwebtoken';
import { User } from '../../models/user';


const publicApiHost = process.env.REACT_APP_PUBLIC_API_HOST;
const apiHost = process.env.REACT_APP_API_HOST;

const getMyBook = async (address) => {
  try {
    let res = await axios.get(`${publicApiHost}${publicApi.GET_INDEX}/${address}`);
    // let res = await axios.post('https://699m468ak3.execute-api.us-west-2.amazonaws.com/post');
    return res.data.posts;
  } catch (error) {
    console.log("[getMyBook][error]", error);
    return []
  }
};



// TODO rename
const getSubscribedBook = async ({ subscribed }) => {
  let postSubscribed = [], combinePosts = [];
  try {
    await Promise.all(subscribed.map(async (sbs) => {
      try {
        let res = await axios.get(`${sbs.url}`);
        if (res?.data?.posts) {
          postSubscribed.push(res?.data?.posts);
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
      combinePosts = [...combinePosts, ...posts]
    })
  }
  catch (e) {
    console.warn("[getHostsBook][combinePosts]", e);
  }
  return combinePosts;
};

const getAllHostsBook = async () => {
  let data;
  try {
    ({ data } = await axios.get(`${apiHost}${userApi.SUBSCRIBED}`));
  } catch (e) {
    console.warn("[getBookSaga][getAllHostsBook]", e);
  }

  try {
    return await getSubscribedBook({ subscribed: data });
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
  let gatheredPosts = [], arrPosts, arrSources, myPosts;
  if (wif && accessToken && accessTokenDecoded.exp * 1000 > new Date().getTime()) {
    const resData = yield call(getUser, { axios: axios, token: accessToken });
    if (resData) {
      const { data } = resData;
      const userModel = new User({
        isAuth: true,
        address: data.address,
        name: data.userName,
        wif: wif,
        subscribed: data.subscribed,
        hosts: data.hosts
      });
      const user = userModel.newUser;
      yield put({ type: USER_ACTIONS.SET_USER, payload: user });

      try {
        myPosts = yield call(getMyBook, data.address);
      }
      catch (e) {
        myPosts = [];
        console.warn("[workerGetBook][getMyBook]", e);
      }
      try {
        if (Array.isArray(data.subscribed)) {
          gatheredPosts = yield call(getSubscribedBook, { subscribed: data.subscribed });
        }
      } catch (e) {
        console.warn("[workerGetBook][getSubscribedBook]", e);
      }


      try {
        // arrPosts = [...myPosts];
        arrPosts = [...myPosts, ...gatheredPosts];
      } catch (e) {
        console.warn('Destructuring myPost, hostPost, hostsSources', e)
      }
      userExist = true;
    }
    // dispatch(postActions.getBook({ isRegistered: false }));
  }
  if (!userExist) {
    console.log('userExist', userExist);
    console.log('userExist', userExist);
    console.log('userExist', userExist);
    console.log('userExist', userExist);
    console.log('userExist', userExist);
    try {
      arrPosts = yield call(getAllHostsBook);
    } catch (e) {
      console.warn('[getBookSaga][getAllHosts]', e)
      arrPosts = [];
    }
  }

  const hostsSources = dummyBook.source;
  arrSources = [...hostsSources];
  if (!arrPosts) { return }
  const book = yield call(getCashData, arrPosts, arrSources);
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


