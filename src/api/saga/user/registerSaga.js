import { takeEvery, call, select, put } from "redux-saga/effects";
import { userApi } from "../../../config/http.config";
import { ACTIONS } from "../../storage/user";
import srp from 'secure-remote-password/client';
import { getRegisterUserData } from '../../../libs/signature.js';
import { User } from '../../models/user';
import routes from '../../../config/routes.config';

const getDataSrp = ({ login, password }) => {
    const salt = srp.generateSalt();
    const privateKey = srp.derivePrivateKey(salt, login, password)
    const verifier = srp.deriveVerifier(privateKey);
    return {
        salt,
        verifier
    }
}

const sendUserData = async (axios, data) => {
    try {
        let res = await axios.post(userApi.REGISTER, data);
        return res;
    } catch (error) {
        console.log("[sendUserDataSaga][sendUserData]", error);
    }
};



export function* workerRegister(action) {
    const axios = yield select((state) => state.axios.axios);
    const srpData = getDataSrp({ login: action.payload.login, password: action.payload.password });
    const userBitcoinData = getRegisterUserData({ password: action.payload.password, wifString: action.payload.wif });

    const data = {
        salt: srpData.salt,
        verifier: srpData.verifier,
        login: action.payload.login,
        address: userBitcoinData.address,
        encryptedWif: userBitcoinData.encryptedWif,
    }
    let user;
    const userResponse = yield call(sendUserData, axios, data)
    if (userResponse.data) {
        const userModel = new User({
            isAuth: true,
            address: userResponse.data.address,
            name: userResponse.data.login,
            wif: userBitcoinData.wif
        });
        user = userModel.newUser;
        sessionStorage.setItem('accessToken', userResponse.data.accessToken);
        sessionStorage.setItem('wif', userBitcoinData.wif);
        yield put({ type: ACTIONS.SET_USER, payload: user });
        action.payload.history.push(routes.feed);
    }
}

export default function* watchRegister() {
    yield takeEvery(ACTIONS.SEND_REGISTER_DATA, workerRegister);
}
