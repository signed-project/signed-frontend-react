import { takeEvery, call, select, put } from "redux-saga/effects";
import { publicApi, userApi } from "../../../config/http.config";
import { ACTIONS as POST_ACTIONS } from "../../storage/post";
import { ACTIONS as SOURCE_ACTIONS } from "../../storage/source";
import { dummyBook } from "../../../dummyData/dummyIndex";
import { getCashData } from "./_aggregationBook";
import axios from "axios";
import routes from '../../../config/routes.config';
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

function* workerGetBook(action) {
  const { isRegistered, history } = action.payload;
  console.log('!!!!!!!!!!!isRegistered!!!!!!!!!!', isRegistered);
  // const axios = yield select((state) => state.axios.axios);
  let gatheredPosts = [], arrPosts, arrSources;
  if (isRegistered) {
    const { address } = yield select((state) => state.user.source);
    const subscribed = yield select((state) => state.user?.subscribed);
    let myPosts;
    try {
      myPosts = yield call(getMyBook, address);
    }
    catch (e) {
      myPosts = [];
      console.warn("[workerGetBook][getMyBook]", e);
    }
    try {
      if (subscribed) {
        gatheredPosts = yield call(getSubscribedBook, { subscribed });
      }
    } catch (e) {
      console.warn("[workerGetBook][getSubscribedBook]", e);
    }

    gatheredPosts = Array.isArray(gatheredPosts) ? gatheredPosts : [gatheredPosts];

    try {
      // arrPosts = [...myPosts];
      arrPosts = [...myPosts, ...gatheredPosts];
      console.log('myPosts', myPosts);
      console.log('gatheredPosts', gatheredPosts);
      console.log('arrPosts', arrPosts);
    } catch (e) {
      console.warn('Destructuring myPost, hostPost, hostsSources', e)
    }
  }

  else {
    try {
      arrPosts = yield call(getAllHostsBook);
    } catch (e) {
      console.warn('[getBookSaga][getAllHosts]', e)
      arrPosts = [];
    }
  };
  const hostsSources = dummyBook.source;
  arrSources = [...hostsSources];
  if (!arrPosts) { return }
  console.log('arrPosts----2', arrPosts);
  const book = yield call(getCashData, arrPosts, arrSources);
  console.log('book----get --book', book);
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
  if (history) {
    history.push(routes.feed);
  }
}


export default function* watchGetBook() {
  yield takeEvery(POST_ACTIONS.GET_BOOK, workerGetBook);
}