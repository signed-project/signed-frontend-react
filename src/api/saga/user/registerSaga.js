import { takeEvery, call, select, put } from "redux-saga/effects";
import { userApi } from "../../../config/http.config";
import { ACTIONS as ACTIONS_USER } from "../../storage/user";
import { ACTIONS as ACTIONS_POST } from "../../storage/post";
import srp from 'secure-remote-password/client';
import { getRegisterUserData, getSignatures, getHash } from '../../../libs/signature.js';
import { User } from '../../models/user';
import routes from '../../../config/routes.config';
// import routes from '../../../config/routes.config';

const getDataSrp = ({ userName, password }) => {
    const salt = srp.generateSalt();
    const privateKey = srp.derivePrivateKey(salt, userName, password)
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
    yield put({ type: ACTIONS_USER.SET_LOADING, payload: true });
    let user;

    const axios = yield select((state) => state.axios.axios);
    const { userName, publicName, password, history, avatar } = action.payload;
    const srpData = getDataSrp({ userName: userName, password: password });
    const userBitcoinData = getRegisterUserData({ password: action.payload.password, wifString: action.payload.wif });

    const hosts =
        [{ assets: process.env.REACT_APP_API_HOST_ASSETS, index: `${process.env.REACT_APP_API_HOST}/prod/${userBitcoinData.address}` }];

    const userModel = new User({
        isAuth: true,
        address: userBitcoinData.address,
        name: userName,
        wif: userBitcoinData.wif,
        hosts
    });
    user = userModel.newUser;

    const data = {
        salt: srpData.salt,
        verifier: srpData.verifier,
        userName: userName,
        address: userBitcoinData.address,
        encryptedWif: userBitcoinData.encryptedWif,
        source: user.source
    }

    const userResponse = yield call(sendUserData, axios, data);
    if (userResponse?.data) {
        sessionStorage.setItem('accessToken', userResponse.data.accessToken);
        sessionStorage.setItem('wif', userBitcoinData.wif);
        const userObject = {
            ...user,
            subscribed: userResponse.data.subscribed,
            source: {
                ...user.source,
                publicName,
                avatar
            }
        };
        const currentUser = new User({})
        currentUser.setUserData = userObject;
        const userToStore = currentUser.newUser;
        yield put({ type: ACTIONS_USER.SET_USER, payload: userToStore });
        yield put({ type: ACTIONS_POST.GET_BOOK, payload: { isRegistered: true } });
        history.push(routes.feed);
    }
    yield put({ type: ACTIONS_USER.SET_LOADING, payload: false });
}

export default function* watchRegister() {
    yield takeEvery(ACTIONS_USER.SEND_REGISTER_DATA, workerRegister);
}
