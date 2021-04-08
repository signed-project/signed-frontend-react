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
import postsDummy from '../../dummyData/dummyPosts.json';
import stringify from 'fast-json-stable-stringify';
import sortKeys from 'sort-keys';

const App = () => {
  const [themeVal, setThemeVal] = useState(layoutType.showLayout);
  const isAuth = useSelector(state => state.user.isAuth)
  console.log('is', isAuth);


  let firstPost = postsDummy.posts[0];
  firstPost = sortKeys(firstPost);
  console.log('firstPostSort____________', firstPost);

  firstPost = stringify(firstPost);

  console.log('firstPost____json________', firstPost);


  var ciphertext = CryptoAES.encrypt(firstPost, 'secret key 123');
  var _ciphertext = CryptoAES.decrypt(ciphertext.toString(), 'secret key 123');
  console.log("+++++++++++++++++++++++++ono", _ciphertext);







  // console.log(crypto.SHA256("password").toString());
  // const crypto = sha256('nonce' + 'message');

  console.log('CryptoJS_______', ciphertext.toString());




  // var privateKey = new bitcore.PrivateKey('L23PpjkBQqpAF4vbMHNfTZAb3KFPBSawQ7KinFTzz7dxq6TZX8UA');
  // var message = new Message('This is an example of a signed message.');

  // var signature = message.sign(privateKey);
  // console.log('signature', signature);

  const API_HOST = process.env.REACT_APP_API_HOST;

  console.log('API_HOST___________333__', process.env.REACT_APP_API_HOST);
  console.log('process.env.NODE_ENV_____________', process.env.NODE_ENV);
  console.log('process.env_____________', process.env);
  console.log('API_HOST_____________', API_HOST);
  console.log('API_HOST_____________', API_HOST);

  const state = {
    theme: themeVal,
    toggleTheme: (val) => setThemeVal(val)
  };
  return (
    <BrowserRouter basename={'/'}>
      <LayoutProvider.Provider value={state}  >
        <BrowserRouter>
          <MainRouts />
        </BrowserRouter>
      </LayoutProvider.Provider>
    </BrowserRouter >
  );
};

export default App;
