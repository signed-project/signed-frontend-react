import { all } from "redux-saga/effects";
import watchPublishPost from "./post/publishPostSaga";
import watchGetUserData from "./user/getUserSaga";
import watchRegister from "./user/registerSaga";
import watchLogin from "./user/loginSaga";
import watchUpdateUser from "./user/updateUserSaga";
import watchGetInboxSaga from "./inbox/getInboxSaga";
import watchSendMentionedPermission from "./inbox/sendMentionedPermissionSaga";

export default function* rootSaga() {
  yield all([
    watchPublishPost(),
    watchGetUserData(),
    watchRegister(),
    watchLogin(),
    watchUpdateUser(),
    watchGetInboxSaga(),
    watchSendMentionedPermission(),
  ]);
}
