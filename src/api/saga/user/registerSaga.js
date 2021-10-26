import { takeEvery, call, select, put } from "redux-saga/effects";
import { inboxApi, userApi, publicApi, hostApi } from "../../../config/http.config";
import { ACTIONS as ACTIONS_USER } from "../../storage/user";
import { ACTIONS as ACTIONS_POST } from "../../storage/post";
import { ACTIONS as ACTIONS_AXIOS } from "../../storage/axios";
import srp from 'secure-remote-password/client';
import { getRegisterUserData } from '../../../libs/signature.js';
import { User } from '../../models/user';
import routes from '../../../config/routes.config';

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
        console.warn("[registerSaga][sendUserData]", error);
    }
};

export function* workerRegister(action) {
    yield put({ type: ACTIONS_USER.SET_LOADING, payload: true });
    let user;

    const axios = yield select((state) => state.axios.axios);
    const { userName, publicName, password, history, avatar } = action.payload;
    const srpData = getDataSrp({ userName: userName, password: password });

    const userBitcoinData = getRegisterUserData({ password: action.payload.password, wifString: action.payload.wif });
    console.log('{ password: action.payload.password, wifString: action.payload.wif }', { password: action.payload.password, wifString: action.payload.wif });

 

    const hosts = [
        {
            assets: `${hostApi.API_HOST_ASSETS}`,
            index: `${hostApi.PUBLIC_API_INDEX_HOST}/${userBitcoinData.address}`,
            inbox: `${hostApi.API_HOST}${inboxApi.INBOX}`,
            tag: `${hostApi.API_TAG_HOST}`,
        }];

    const userModel = new User({
        isAuth: true,
        address: userBitcoinData.address,
        wif: userBitcoinData.wif,
        hosts,
        avatar,
        publicName
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
        if (typeof userResponse.data.accessToken === "string") {
            console.log('ACTIONS_AXIOS.SET_USER', ACTIONS_AXIOS.SET_TOKEN);
            console.log('userResponse.data.accessToken', userResponse.data.accessToken);
            yield put({ type: ACTIONS_AXIOS.SET_TOKEN, payload: userResponse.data.accessToken });
        }
        else {
            console.warn("[registerSaga][workerRegister][userResponse.data.accessToken not a string]");
            return;
        }
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
        yield put({ type: ACTIONS_POST.GET_INDEX, payload: { isRegistered: true } });
        history.push(routes.feed);
    }
    yield put({ type: ACTIONS_USER.SET_LOADING, payload: false });
}



export default function* watchRegister() {
    yield takeEvery(ACTIONS_USER.SEND_REGISTER_DATA, workerRegister);
}
