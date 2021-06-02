import { takeEvery, call, select, put } from 'redux-saga/effects';
import srp from 'secure-remote-password/client';
import { userApi } from "../../../config/http.config";
import { ACTIONS } from "../../storage/user";
import { User } from '../../models/user';
import routes from '../../../config/routes.config';


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
    try {
        const sendData = { login: action.payload.login, clientEphemeralPublic: clientEphemeral.public };
        const { data } = yield call(sendUserData, axios, sendData);
        resFirstStep = data;
    } catch (e) {
        console.warn('workerLogin--1', e);
    }
    try {
        const privateKey = srp.derivePrivateKey(resFirstStep.salt, action.payload.login, action.payload.password);
        const clientSession = srp.deriveSession(clientEphemeral.secret, resFirstStep.serverPublicEphemeral, resFirstStep.salt, action.payload.login, privateKey)
        const dataSendSessionProof = {
            clientSessionProof: clientSession.proof,
            login: action.payload.login,
            clientEphemeralPublic: clientEphemeral.public,
        }
        const { data } = yield call(sendSessionProof, axios, dataSendSessionProof);
        serverSessionProof = data.serverSessionProof
        const isVerify = srp.verifySession(clientEphemeral.public, clientSession, serverSessionProof);
        const proof = typeof isVerify === 'undefined';

        if (proof) {
            isProof = true;
            sessionStorage.setItem('proof', serverSessionProof);
        } else { isProof = false };
    } catch (e) {
        console.warn('workerLogin--2', e);
        isProof = false
    }


    try {
        // TODO add token in 
        if (isProof) {
            const sendLoginData = {
                login: action.payload.password,
                serverSessionProof
            };
            const { data } = yield call(loginGetUser, axios, sendLoginData);
        }
    } catch (e) {
        console.warn('workerLogin--3', e);
    }
}

export default function* watchLogin() {
    yield takeEvery(ACTIONS.SEND_LOGIN_DATA, workerLogin)
}