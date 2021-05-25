import stringify from 'fast-json-stable-stringify';
import sortKeys from 'sort-keys';
import { nanoid } from 'nanoid';
import CryptoJS from 'crypto-js';
import bs58 from 'bs58';
import wif from 'wif';
import bip38 from 'bip38';
import * as   bitcoin from 'bitcoinjs-lib';
import * as   bitcoinMessage from 'bitcoinjs-message';


/**
 * @tutorial way to get wif and atc 
 * 
 *  const keyPairRundom = bitcoin.ECPair.makeRandom();
//   const keyPairRun = bitcoin.ECPair.fromPrivateKey();
  const { address } = bitcoin.payments.p2pkh({ pubkey: keyPairRundom.publicKey });
  console.log('keyPair__________________________________________________________', address);
  const privateKeyBuffer = Buffer.from(keyPairRundom.privateKey)
  const privateKeyRun = privateKeyBuffer.toString('hex')
  var wif = keyPairRundom.toWIF();

   TODO: to clean component!!!
   var keyPair = bitcoin.ECPair.fromWIF('L4rK1yDtCWekvXuE6oXD9jCYfFNV2cWRpVuPLBcCU2z8TrisoyY1');
  var keyPair = bitcoin.ECPair.fromWIF('Kx7DQ8DtiTaEYut5f85jAG3bhPNJUB6neER3yQaVgueeLDT7Ax8e');
  var privateKey = keyPair.privateKey;
  var message = 'This is an example of a signed message.';

  var signature = bitcoinMessage.sign(message, privateKey, keyPair.compressed);

   const bytes = Buffer.from(signature, 'hex')
   const code = bs58.encode(bytes);

   const bytesRecode = bs58.decode(address)
   const hex = bytesRecode.toString('hex')
   1F3sAm6ZtwLAUnj7d38pGFxtP3RVEvtsbV
  var addressTest = '19FRhaywUUpvMxUMSxgpTvc44Bj9VFd3BT';
  const isValid = bitcoinMessage.verify(message, addressTest, signature.toString('base64'));
  console.log('verify____!!!!!!!!!!!!!!!!', bitcoinMessage.verify(message, addressTest, 'HyevO7YXuJVEmBp+WqhU1uQgH8Y8G4A7RlYr413wjFs6Em8BVq6ypTonydwcQMjm3ysKhWynFGkpxUsRLY+TbgA='));




    console.log(crypto.SHA256("password").toString());
    const crypto = sha256('nonce' + 'message');

    console.log('CryptoJS_______', ciphertext.toString());


    var privateKey = new bitcore.PrivateKey('L23PpjkBQqpAF4vbMHNfTZAb3KFPBSawQ7KinFTzz7dxq6TZX8UA');
    var message = new Message('This is an example of a signed message.');

    var signature = message.sign(privateKey);
    console.log('signature', signature); 

 */



export const getRegisterUserData = ({ password }) => {
    const keyPair = bitcoin.ECPair.makeRandom();
    const wifString = keyPair.toWIF();
    const decoded = wif.decode(wifString);
    const encryptedKey = bip38.encrypt(decoded.privateKey, decoded.compressed, password);
    const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey });
    return {
        wif: encryptedKey,
        address: address,
    };


}


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
        // console.error('[signature][getJsonStringFromObj]', e);
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
    let resHash;
    try {
        const hash = CryptoJS.SHA256(postJson);
        const hashString = hash.toString(CryptoJS.enc.Hex);
        const bytes = Buffer.from(hashString, 'hex');
        resHash = bs58.encode(bytes);
    } catch (e) {
        console.error('[getHash]', e);
    }
    return resHash;
}


export const generateId = () => {
    return nanoid();
}

export const isSignatureValid = (post) => {
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