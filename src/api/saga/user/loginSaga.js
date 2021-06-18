import { takeEvery, call, select, put } from 'redux-saga/effects';
import srp from 'secure-remote-password/client';
import { userApi } from "../../../config/http.config";
import { ACTIONS } from "../../storage/user";
import { User } from '../../models/user';
import routes from '../../../config/routes.config';
import wif from 'wif';
import bip38 from 'bip38';
const sendUserData = async (axios, data) => {
    try {
        let res = await axios.post(userApi.LOGIN, data);
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
        let res = await axios.post(userApi.GET_USER, data);
        return res;
    } catch (error) {
        console.log("[sendLogin][sendUserData]", error);
    }
};

function* workerLogin(action) {
    const axios = yield select((state) => state.axios.axios);
    let resFirstStep, isProof, serverSessionProof;
    const clientEphemeral = srp.generateEphemeral()
    const password = action.payload.password;
    const login = action.payload.login;
    const history = action.payload.history;
    try {
        const sendData = { userName: action.payload.login, clientPublicEphemeral: clientEphemeral.public };
        const { data } = yield call(sendUserData, axios, sendData);
        resFirstStep = data;
    } catch (e) {
        console.warn('workerLogin--1', e);
    }
    try {
        const privateKey = srp.derivePrivateKey(resFirstStep.salt, login, password);
        const clientSession = srp.deriveSession(clientEphemeral.secret, resFirstStep.serverPublicEphemeral, resFirstStep.salt, action.payload.login, privateKey)
        const dataSendSessionProof = {
            clientSessionProof: clientSession.proof,
            login: login,
            clientEphemeralPublic: clientEphemeral.public,
        }
        const { data } = yield call(sendSessionProof, axios, dataSendSessionProof);
        serverSessionProof = data.serverSessionProof
        const isVerify = srp.verifySession(clientEphemeral.public, clientSession, serverSessionProof);
        const proof = typeof isVerify === 'undefined';

        if (proof) {
            isProof = true;
        } else { isProof = false };
    } catch (e) {
        console.warn('workerLogin--2', e);
        isProof = false
    }


    try {
        if (isProof) {
            const sendLoginData = {
                login: login,
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
                    wif: wifEncode
                })
                const userItem = userModel.newUser;
                console.log('userItem', userItem);
                yield put({ type: ACTIONS.SET_USER, payload: userItem });
                action.payload.history.push(routes.feed);
            }
        }
    } catch (e) {
        console.warn('workerLogin--3', e);
    }
}

export default function* watchLogin() {
    yield takeEvery(ACTIONS.SEND_LOGIN_DATA, workerLogin)
}