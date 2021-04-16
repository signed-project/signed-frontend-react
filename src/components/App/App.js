import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import LayoutProvider from '../layout/LayoutProvider';
import MainRouts from './MainRoutes';
import { layoutType } from '../layout/LayoutProvider.jsx';
// import * as crypto from "crypto-js";
// import sha256 from 'crypto-js/sha256';
import CryptoAES from 'crypto-js/aes';
import CryptoENC from 'crypto-js/enc-utf8';
import bs58 from 'bs58';

import { post as postsDummy } from '../../dummyData';
import stringify from 'fast-json-stable-stringify';
import sortKeys from 'sort-keys';
import * as   bitcoin from 'bitcoinjs-lib';
import * as   bitcoinMessage from 'bitcoinjs-message';


const App = () => {
  const [themeVal, setThemeVal] = useState(layoutType.showLayout);
  const isAuth = useSelector(state => state.user.isAuth);
  console.log('is', isAuth);



  const keyPairRundom = bitcoin.ECPair.makeRandom();
  // const keyPairRun = bitcoin.ECPair.fromPrivateKey();
  const { address } = bitcoin.payments.p2pkh({ pubkey: keyPairRundom.publicKey });
  // console.log('keyPair__________________________________________________________', address);
  const privateKeyBuffer = Buffer.from(keyPairRundom.privateKey)
  const privateKeyRun = privateKeyBuffer.toString('hex')
  var wif = keyPairRundom.toWIF();

  console.log('_______________privateKeyRun________________', privateKeyRun);
  console.log('keyPair________________', keyPairRundom.privateKey);
  console.log('address________________', address);
  console.log('wif________________', wif);


  // var keyPair = bitcoin.ECPair.fromWIF('L4rK1yDtCWekvXuE6oXD9jCYfFNV2cWRpVuPLBcCU2z8TrisoyY1');
  var keyPair = bitcoin.ECPair.fromWIF('Kx7DQ8DtiTaEYut5f85jAG3bhPNJUB6neER3yQaVgueeLDT7Ax8e');
  var privateKey = keyPair.privateKey;
  var message = 'This is an example of a signed message.';

  var signature = bitcoinMessage.sign(message, privateKey, keyPair.compressed);

  // const bytes = Buffer.from(signature, 'hex')
  // const code = bs58.encode(bytes);

  // const bytesRecode = bs58.decode(address)
  // const hex = bytesRecode.toString('hex')
  // 1F3sAm6ZtwLAUnj7d38pGFxtP3RVEvtsbV
  var addressTest = '19FRhaywUUpvMxUMSxgpTvc44Bj9VFd3BT';
  // console.log('verify____', code);
  const isValid = bitcoinMessage.verify(message, addressTest, signature.toString('base64'));
  // console.log('verify____!!!!!!!!!!!!!!!!', bitcoinMessage.verify(message, addressTest, 'HyevO7YXuJVEmBp+WqhU1uQgH8Y8G4A7RlYr413wjFs6Em8BVq6ypTonydwcQMjm3ysKhWynFGkpxUsRLY+TbgA='));

  // const val = Base58.encode(Buffer.from(signature.toString()));
  // console.log('val________________58', val);
  // console.log('val________________58', val);

  let firstPost = postsDummy.posts[0];
  firstPost = sortKeys(firstPost);
  // console.log('firstPostSort____________', firstPost);

  firstPost = stringify(firstPost);

  // console.log('firstPost____json________', firstPost);


  var ciphertext = CryptoAES.encrypt(firstPost, 'secret key 123');
  var _ciphertext = CryptoAES.decrypt(ciphertext.toString(), 'secret key 123');
  // console.log("+++++++++++++++++++++++++ono", _ciphertext);







  // console.log(crypto.SHA256("password").toString());
  // const crypto = sha256('nonce' + 'message');

  // console.log('CryptoJS_______', ciphertext.toString());




  // var privateKey = new bitcore.PrivateKey('L23PpjkBQqpAF4vbMHNfTZAb3KFPBSawQ7KinFTzz7dxq6TZX8UA');
  // var message = new Message('This is an example of a signed message.');

  // var signature = message.sign(privateKey);
  // console.log('signature', signature);

  const API_HOST = process.env.REACT_APP_API_HOST;



  const state = {
    theme: themeVal,
    toggleTheme: (val) => setThemeVal(val)
  };
  return (
    <BrowserRouter basename={'/'}>
      <LayoutProvider.Provider value={state}>
        <BrowserRouter>
          <MainRouts />
        </BrowserRouter>
      </LayoutProvider.Provider>
    </BrowserRouter >
  );
};

export default App;
