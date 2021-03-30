import { take } from 'redux-saga/effects';

export default function* watchAxios() {
    while (true) {
        try {
            yield take('setAxios');
        } catch (err) {
            console.error(err);
        }
    }
}