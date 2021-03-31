import { all } from "redux-saga/effects";
import watchAxios from "./user/userSaga";

export default function* rootSaga() {
    yield all([
        watchAxios(),
    ]);
    // , watchUser()
}
