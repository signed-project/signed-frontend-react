import stringify from 'fast-json-stable-stringify';
import sortKeys from 'sort-keys';
import { nanoid } from 'nanoid';
import CryptoJS from 'crypto-js';
import bs58 from 'bs58';
import * as   bitcoin from 'bitcoinjs-lib';
import * as   bitcoinMessage from 'bitcoinjs-message';


export const getJsonStringFromObj = (postObj) => {
    let jsonPost;
    try {
        let postCopy = JSON.parse(JSON.stringify(postObj));
        if (postCopy.hash || postCopy.signatures) {
            delete postCopy.hash;
            delete postCopy.signatures;
        }
        postCopy = sortKeys(postCopy);
        jsonPost = stringify(postCopy);
    } catch (e) {
        console.error('[signature][getJsonStringFromObj]', e);
        jsonPost = ''
    }
    return jsonPost;
}

export const getSignatures = (post, wfi) => {
    let signatureString;
    try {
        const postJson = getJsonStringFromObj(post);
        const keyPair = bitcoin.ECPair.fromWIF(wfi);
        const privateKey = keyPair.privateKey;
        const signature = bitcoinMessage.sign(postJson, privateKey, keyPair.compressed);
        signatureString = signature.toString('base64');
    }
    catch (e) {
        console.error('[signature][getSignatures]', e);
        signatureString = ''
    }
    return signatureString;
}

export const getHash = (post) => {
    const postJson = getJsonStringFromObj(post);
    let address;
    try {
        let hash = CryptoJS.SHA256(postJson)
        hash = hash.toString(CryptoJS.enc.Hex);
        const bytes = Buffer.from(hash, 'hex')
        address = bs58.encode(bytes)
    } catch (e) {
        console.error('[getHash]', e);
    }
    return address;
}

export const generateId = () => {
    return nanoid();
}

export const isPostValid = (post) => {
    const { address } = post.source;
    const { signatures } = post;
    const message = getJsonStringFromObj(post);
    let isValid;
    try {
        isValid = bitcoinMessage.verify(message, address, signatures);
    } catch (e) {
        console.log("[isPostValid]", e);
        isValid = false;
    }
    return isValid;
};