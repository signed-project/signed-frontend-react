import { takeEvery } from 'redux-saga/effects';
import { ACTIONS } from '../../storage/sourse/reducer';


export function* workerLogin(action) {
    console.log('workerLogin');
}

export default function* watchUser() {
    yield takeEvery(ACTIONS.TEST, workerLogin);
}


// while (true) {
//         try {
//             yield take('setAxios',);
//         } catch (err) {
//             console.error(err);
//         }
//     }