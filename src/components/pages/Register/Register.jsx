import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useHistory } from 'react-router-dom';
import RegisterHeader from '../../utils/RegisterHeader/RegisterHeader';
import styles from './register.module.scss';
import Input from '../../utils/Input/Input';
import Button from '../../utils/Button/Button';
import routes from '../../../config/routes.config';
import { userApi } from '../../../config/http.config';
import srp from 'secure-remote-password/client';
import { getRegisterUserData } from '../../../libs/signature.js';
import { userActions } from '../../../api/storage/user';

const Register = ({ toggleTheme }) => {
  const typeMap = {
    createAddress: 'createAddress',
    haveAddress: 'haveAddress'
  };
  const initialForm = {
    wif: { value: '', warning: '' },
    login: { value: '', warning: '' },
    password: { value: '', warning: '' },
    passwordRepeat: { value: '', warning: '' }
  }

  const history = useHistory();
  const dispatch = useDispatch();
  const axios = useSelector(state => state.axios.axios);
  const [form, setForm] = useState(initialForm);
  const [chooseTypeRegistration, setChooseTypeRegistration] = useState(true);
  const [typeRegistration, setTypeRegistration] = useState('');

  useEffect(() => {
    toggleTheme(false);
  }, [toggleTheme]);

  useEffect(() => {
    if (typeRegistration === typeMap.createAddress)
      setForm(prev => {
        delete prev.wif;
        return ({
          ...prev
        })
      })
  }, [typeRegistration]);





  const handleForm = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setForm(prev => {
      const itemForm = form[name];
      return {
        ...prev,
        [name]: {
          ...itemForm,
          warning: '',
          value: value
        }
      }
    })

  }

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


  const checkIsLoginFree = async ({ login }) => {
    try {
      let { data } = await axios.post(userApi.IS_FREE_LOGIN, { login: login });
      console.log('data', data);
      const isFreeLogin = data?.isFreeLogin
      let warningMessage = '';
      if (isFreeLogin === false) {
        warningMessage = 'The login you entered is already in use'
      }
      setForm((prev) => {
        const loginItem = form['login'];
        return ({
          ...prev,
          login: { ...loginItem, warning: warningMessage }
        })
      })
      return isFreeLogin;
    } catch (e) {
      console.warn('[checkIsLoginFree]', e);
    }
  }

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
    dispatch(userActions.setUser(data));
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('accessToken', accessToken);
    history.push(routes.feed);
  }

  const formValidate = () => {
    let isValid = true;
    let formCopy = JSON.parse(JSON.stringify(form));

    if (form.password !== form.passwordRepeat) {
      isValid = false;
      formCopy.passwordRepeat.warning = 'Password mismatch';
    }

    Object.keys(formCopy).map(fieldName => {
      console.log('form[fieldName].value.length', formCopy[fieldName].value.length);
      if (formCopy[fieldName].value.length === 0) {
        console.log('type', fieldName);
        formCopy[fieldName].warning = 'Field this field';
        isValid = false
      }
    })
    setForm(formCopy);
    console.log('isValid', isValid);
    return isValid;
  }

  const handleSendForm = async () => {
    //  TODO : validation form

    if (!formValidate()) {
      return;
    }

    const srpData = getSendDataSrp({ login: form.login.value, password: form.password.value });
    const userBitcoinData = getRegisterUserData({ password: form.password.value });
    const data = {
      address: userBitcoinData.address,
      encryptedWif: userBitcoinData.encryptedWif,
      salt: srpData.salt,
      privateKey: srpData.privateKey,
      verifier: srpData.verifier,
      login: form.login.value
    }




    /*  try {
       const isLoginFree = await checkIsLoginFree({ login: data.login });
       if (isLoginFree === false) {
         return;
       }
     } catch (e) {
       console.warn('[handleSendForm----1]', e);
     }
 
     try {
       let res = await axios.post(userApi.REGISTER, data);
       if (res.data) {
         // TODO add validation
         setNewUser({
           address: res.data.address,
           name: res.data.name,
           wif: userBitcoinData.wif,
           accessToken: res.data.accessToken,
           refreshToken: res.data.refreshToken
         });
       }
       return res;
     } catch (e) {
       console.warn('[handleSendForm----2]', e)
     } */
  }


  const handleChooseRegistration = ({ type }) => {
    if (!Object.keys(typeMap).includes(type)) {
      return
    }
    setChooseTypeRegistration(false);
    switch (type) {
      case typeMap.createAddress: {
        setTypeRegistration(type)
      }
      case typeMap.haveAddress: {
        setTypeRegistration(type)
      }
      default: return
    }

  }


  console.log('form', form);

  return (
    <>
      <RegisterHeader />


      <div className={styles.page}>
        <div className={styles.title}>
          <h3 >Register</h3>
        </div>

        {chooseTypeRegistration ?
          <div className={styles.chooseButtonWrapper}>
            <Button className="primary" onClick={() => handleChooseRegistration({ type: 'createAddress' })}>Create new Bitcoin address</Button>
            <Button className="clean" onClick={() => handleChooseRegistration({ type: 'haveAddress' })}>I have Bitcoin address</Button>
          </div>
          :
          <div className={styles.formWrapper}>
            {typeRegistration === typeMap.haveAddress && <Input title={'Enter Bitcoin address'} name={'wif'} warning={form.wif.warning} type={'text'} handleChange={handleForm} value={form.wif.value} />}
            <Input title={'Nickname'} name={'login'} warning={form.login.warning} type={'text'} handleChange={handleForm} value={form.login.value} />
            <Input title={'Password'} type={'password'} warning={form.password.warning} name={'password'} handleChange={handleForm} value={form.password.value} />
            <Input title={'Repeat password'} type={'password'} warning={form.passwordRepeat.warning} name={'passwordRepeat'} handleChange={handleForm} value={form.passwordRepeat.value} />
            <NavLink to={routes.passwordRecovery} className={styles.passForgot}> Forgot your password?</NavLink>
            <Button className="primary" onClick={() => { handleSendForm() }}>Register</Button>
          </div>
        }
        <div className={styles.footer}>
          <NavLink to={routes.login} className={styles.passForgot}> I don't have an account</NavLink>
        </div>
      </div>
    </>
  );
};

export default Register;
