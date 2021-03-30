import { all } from "redux-saga/effects";
import watchAxios from "./axios/axiosSaga";

export default function* rootSaga() {
    yield all([
        watchAxios(),
    ]);
    // , watchUser()
}
