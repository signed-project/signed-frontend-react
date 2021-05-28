

import { takeEvery, call, select, put } from "redux-saga/effects";
import { userApi } from "../../../config/http.config";
import { ACTIONS } from "../../storage/user";
import srp from 'secure-remote-password/client';
import { getRegisterUserData } from '../../../libs/signature.js';

const getSendDataSrp = ({ login, password }) => {
    const salt = srp.generateSalt();
    const privateKey = srp.derivePrivateKey(salt, login, password)
    const verifier = srp.deriveVerifier(privateKey);
    return {
        salt,
        privateKey,
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

const setNewUser = ({ address, wif, name, updatedAt, refreshToken, accessToken }) => {
    const data = {
        isAuth: true,
        source: {
            address: address,
            name: name,
            updatedAt: updatedAt,
            avatar: {
                contentType: "image/jpeg",
                hash: "f433c21fe3c6c7475f7be0017294547e93d7fcd44617f62bf7f369a13b48e764"
            },
            hosts: [{
                fileStores: ['jdjjdj'],
                index: "url"
            }],
            signatures: 'fjdjd343243jkdfjdk343',
            hash: 'fjdjd343243jkdfjdk343',
        },
        wfi: wif,
    };
    // dispatch(userActions.setUser(data));
    // localStorage.setItem('refreshToken', refreshToken);
    // localStorage.setItem('accessToken', accessToken);
    // history.push(routes.feed);
}

export function* workerSendUserData(action) {
    const axios = yield select((state) => state.axios.axios);

    console.log('action', action);

    const srpData = getSendDataSrp({ login: action.payload.login, password: action.payload.password });
    const userBitcoinData = getRegisterUserData({ password: action.payload.password, wifString: action.payload.wif });
    console.log('srpData', srpData);
    // console.log('userBitcoinData', userBitcoinData);

    const data = {
        salt: srpData.salt,
        privateKey: srpData.privateKey,
        verifier: srpData.verifier,
        login: action.payload.login,
        address: userBitcoinData.address,
        encryptedWif: userBitcoinData.encryptedWif,
    }

    console.log('data+++++++++++++++++++++', data);

    // const userResult = yield call(sendUserData, axios, data)
    // console.log('userResult', userResult);
    // try {
    //     let res = await axios.post(userApi.REGISTER, data);
    //     if (res.data) {
    //         // TODO add validation
    //         // setNewUser({
    //         //     address: res.data.address,
    //         //     name: res.data.name,
    //         //     wif: userBitcoinData.wif,
    //         //     accessToken: res.data.accessToken,
    //         //     refreshToken: res.data.refreshToken
    //         // });
    //     }
    //     return res;
    // } catch (e) {
    //     console.warn('[handleSendForm----2]', e)
    // }

}

export default function* watchSendUserData() {
    yield takeEvery(ACTIONS.SEND_USER_DATA, workerSendUserData);
}
