import { all } from "redux-saga/effects";
import watchPublishPost from "./post/publishPostSaga";
import watchGetBook from "./book/getBookSaga";
import watchGetUserData from "./user/getUserDataSaga";
import watchSendUserData from "./user/sendUserDataSaga";

export default function* rootSaga() {
    yield all([
        watchPublishPost(),
        watchGetBook(),
        watchGetUserData(),
        watchSendUserData(),
    ]);
}
