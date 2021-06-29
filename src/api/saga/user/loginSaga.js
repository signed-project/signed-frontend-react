import { takeEvery, call, select, put } from 'redux-saga/effects';
import srp from 'secure-remote-password/client';
import { userApi } from "../../../config/http.config";
import { ACTIONS as ACTIONS_USER } from "../../storage/user";
import { ACTIONS as ACTIONS_POST } from "../../storage/post";
import { User } from '../../models/user';
import routes from '../../../config/routes.config';
import wif from 'wif';
import bip38 from 'bip38';

const sendUserData = async (axios, data) => {
    try {
        let res = await axios.post(userApi.LOGIN_EXCHANGE_EPHEMERAL_KEYS, data);
        console.log('resresresresresresresres', res);
        return res;
    } catch (error) {
        console.log("[sendLogin][sendUserData]", error);
    }
};
const sendSessionProof = async (axios, data) => {
    try {
        let res = await axios.post(userApi.LOGIN_SESSION_PROOF, data);
        return res;
    } catch (error) {
        console.log("[sendLogin][sendUserData]", error);
    }
};

const loginGetUser = async (axios, data) => {
    try {
        let res = await axios.post(userApi.LOGIN_GET_USER_TOKEN, data);
        return res;
    } catch (error) {
        console.log("[sendLogin][sendUserData]", error);
    }
};

function* workerLogin(action) {
    yield put({ type: ACTIONS_USER.SET_LOADING, payload: true });
    const axios = yield select((state) => state.axios.axios);
    let resFirstStep, isProof, serverSessionProof, sendData;
    const clientEphemeral = srp.generateEphemeral()
    const { password, userName, history } = action.payload;
    const loginError = 'Nickname or password is invalid';
    yield put({ type: ACTIONS_USER.SET_LOGIN_ERROR, payload: '' });
    try {
        sendData = { userName: userName, clientPublicEphemeral: clientEphemeral.public };
        const result = yield call(sendUserData, axios, sendData);
        if (result?.data) {
            resFirstStep = result?.data
        }
    } catch (e) {
        console.warn('workerLogin--1', e);
        yield put({ type: ACTIONS_USER.SET_LOGIN_ERROR, payload: loginError });
    }
    try {
        const privateKey = srp.derivePrivateKey(resFirstStep.salt, userName, password);
        const clientSession = srp.deriveSession(clientEphemeral.secret, resFirstStep.serverPublicEphemeral, resFirstStep.salt, userName, privateKey)
        const dataSendSessionProof = {
            clientSessionProof: clientSession.proof,
            userName: userName,
            clientEphemeralPublic: clientEphemeral.public,
        }
        const { data } = yield call(sendSessionProof, axios, dataSendSessionProof);
        serverSessionProof = data.serverSessionProof;
        const isVerify = srp.verifySession(clientEphemeral.public, clientSession, serverSessionProof);
        console.log('isVerify', isVerify);

        const proof = typeof isVerify === 'undefined';
        console.log('proof', proof);

        if (proof) {
            isProof = true;
        } else { isProof = false };
    } catch (e) {
        console.warn('workerLogin--2', e);
        isProof = false;
        yield put({ type: ACTIONS_USER.SET_LOGIN_ERROR, payload: loginError });
    }


    try {
        if (isProof) {
            const sendLoginData = {
                userName: userName,
                serverSessionProof
            };
            const { data } = yield call(loginGetUser, axios, sendLoginData);
            if (data?.token && data?.wif) {
                const decryptedKey = bip38.decrypt(data?.wif, password)
                const wifEncode = wif.encode(0x80, decryptedKey.privateKey, decryptedKey.compressed);
                sessionStorage.setItem('accessToken', data?.token);
                sessionStorage.setItem('wif', wifEncode);

                const userModel = new User({
                    isAuth: true,
                    address: data.address,
                    name: data.login,
                    wif: wifEncode,
                    subscribed: data.subscribed
                })
                const userItem = userModel.newUser;
                console.log('userItem', userItem);
                yield put({ type: ACTIONS_USER.SET_USER, payload: userItem });
                yield put({ type: ACTIONS_POST.GET_BOOK, payload: { isRegistered: true } });
                action.payload.history.push(routes.feed);
            }
        }
    } catch (e) {
        console.warn('workerLogin--3', e);
    }
    yield put({ type: ACTIONS_USER.SET_LOADING, payload: false });
}

export default function* watchLogin() {
    yield takeEvery(ACTIONS_USER.SEND_LOGIN_DATA, workerLogin)
}