import { all } from "redux-saga/effects";
import watchAxios from "./user/userSaga";
import watchPublishPost from "./post/publishPostSaga";
import watchGetBook from "./book/getBookSaga";

export default function* rootSaga() {
    yield all([
        watchAxios(),
        watchPublishPost(),
        watchGetBook(),
    ]);
}
