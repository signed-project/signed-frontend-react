import { all } from "redux-saga/effects";
import watchAxios from "./user/userSaga";
import watchSendPost from "./post/sendPostSaga";

export default function* rootSaga() {
    yield all([
        watchAxios(),
        watchSendPost()
    ]);
    // , watchUser()
}
