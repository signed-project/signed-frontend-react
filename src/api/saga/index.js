import { all } from "redux-saga/effects";
import watchPublishPost from "./post/publishPostSaga";
import watchGetIndex from "./index/getIndexSaga";
import watchGetUserData from "./user/getUserSaga";
import watchRegister from "./user/registerSaga";
import watchLogin from "./user/loginSaga";
import watchUpdateUser from "./user/updateUserSaga";
import watchGetInboxSaga from "./inbox/getInboxSaga";
import watchSendPermissionDecision from "./inbox/sendPermissionSaga";

export default function* rootSaga() {
    yield all([
        watchPublishPost(),
        watchGetIndex(),
        watchGetUserData(),
        watchRegister(),
        watchLogin(),
        watchUpdateUser(),
        watchGetInboxSaga(),
        watchSendPermissionDecision()
    ]);
}
