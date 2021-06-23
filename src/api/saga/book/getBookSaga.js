import { takeEvery, call, select, put } from "redux-saga/effects";
import { publicApi, userApi } from "../../../config/http.config";
import { ACTIONS as POST_ACTIONS } from "../../storage/post";
import { ACTIONS as SOURCE_ACTIONS } from "../../storage/source";
import { dummyBook } from "../../../dummyData/dummyIndex";
import { getCashData } from "./_aggregationBook";
import axios from "axios";

const getMyBook = async (address) => {
  const publicApiHost = process.env.REACT_APP_PUBLIC_API_HOST;
  try {
    let res = await axios.get(`${publicApiHost}${publicApi.GET_INDEX}/${address}`);
    // let res = await axios.post('https://699m468ak3.execute-api.us-west-2.amazonaws.com/post');
    return res.data.posts;
  } catch (error) {
    console.log("[getMyBook][error]", error);
    return []
  }
};




const getSubscribedBook = async ({ subscribed }) => {
  console.log('=========================hosts=========================', subscribed);
  let postSubscribed = [], combinePosts = [];
  try {
    await Promise.all(subscribed.map(async (sbs) => {
      console.log('---------sbs---------', sbs);
      try {
        let res = await axios.get(`${sbs.url}`);
        if (res?.data?.posts) {
          postSubscribed.push(res?.data?.posts);
        }
      } catch (e) {
        console.log("[getSubscribedBook][postSubscribed.push]", e);
      }
    }));
    console.log('!!!!!!!!postSubscribed---postSubscribed', postSubscribed);
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

const getAllHosts = async () => {
  let hostsPosts = [], combinePosts = [];
  try {
    const res = await axios.get(`${userApi.HOSTS}`);
    console.log('!!!!!!!!hostsPosts---hostsPosts', res);
  } catch (e) {
    console.warn("[getBookSaga][getAllHosts]", e);
  }

  try {
    hostsPosts.map(posts => {
      combinePosts = [...combinePosts, ...posts]
    })
  }
  catch (e) {
    console.warn("[getHostsBook][combinePosts]", e);
  }
  return combinePosts;
};

function* workerGetBook(action) {
  const { isRegistered } = action.payload;
  console.log('!!!!!!!!!!!isRegistered!!!!!!!!!!', isRegistered);
  // const axios = yield select((state) => state.axios.axios);
  let gatheredPosts = [], arrPosts, arrSources;
  if (isRegistered) {
    console.log('@@@@@@@@@@@@@@@@@isRegistered@@@@@@@@@@@@@@@@@', isRegistered);

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




    const hostsSources = dummyBook.source;
    gatheredPosts = Array.isArray(gatheredPosts) ? gatheredPosts : [gatheredPosts];

    console.log('----gatheredPosts--------', gatheredPosts);

    try {
      arrPosts = [...myPosts, ...gatheredPosts];
      arrSources = [...hostsSources];
    } catch (e) {
      console.warn('Destructuring myPost, hostPost, hostsSources', e)
    }

  }

  else {
    try {
      const posts = yield call(getAllHosts);
    } catch (e) {
      console.warn('[getBookSaga][getAllHosts]', e)
      arrSources = [];
    }
  }

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

// while (true) {
//         try {
//             yield take('setAxios',);
//         } catch (err) {
//             console.error(err);
//         }
//     }

export default function* watchGetBook() {
  yield takeEvery(POST_ACTIONS.GET_BOOK, workerGetBook);
}