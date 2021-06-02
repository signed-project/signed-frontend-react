import { all } from "redux-saga/effects";
import watchPublishPost from "./post/publishPostSaga";
import watchGetBook from "./book/getBookSaga";
import watchGetUserData from "./user/getUserDataSaga";
import watchRegister from "./user/registerSaga";
import watchLogin from "./user/loginSaga";

export default function* rootSaga() {
    yield all([
        watchPublishPost(),
        watchGetBook(),
        watchGetUserData(),
        watchRegister(),
        watchLogin(),
    ]);
}
