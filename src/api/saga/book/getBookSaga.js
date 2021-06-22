import { call, put, select } from "redux-saga/effects";
import { publicApi } from "../../../config/http.config";
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

export default function* watchGetBook() {
  // const axios = yield select((state) => state.axios.axios);
  const { address } = yield select((state) => state.user.source);
  const hosts = "";
  let hostsPost, arrPosts, arrSources;

  let myPosts;
  try {
    myPosts = yield call(getMyBook, address);

    if (hosts) {
      hostsPost = yield call(getMyBook, address);
    } else {
      // hostsPost = parseJson(stringify(dummyBook.posts));
      hostsPost = dummyBook.posts;
    }
  } catch {
    myPosts = [];
  }

  const hostsSources = dummyBook.source;
  hostsPost = Array.isArray(hostsPost) ? hostsPost : [hostsPost];

  try {
    arrPosts = [...myPosts, ...hostsPost];
    arrSources = [...hostsSources];
  } catch (e) {
    console.warn('Destructuring myPost, hostPost, hostsSources', e)
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

// yield takeEvery(ACTIONS.TEST, workerLogin);
