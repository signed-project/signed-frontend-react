import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useHistory } from 'react-router-dom';
import RegisterHeader from '../../utils/RegisterHeader/RegisterHeader';
import styles from './register.module.scss';
import Input from '../../utils/Input/Input';
import Button from '../../utils/Button/Button';
import routes from '../../../config/routes.config';
import { userApi } from '../../../config/http.config';
import { userActions } from '../../../api/storage/user';
import { isWifFormat } from '../../../libs/signature';


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
    const newForm = JSON.parse(JSON.stringify(form));
    newForm[name].warning = '';
    if (name === 'password') {
      newForm['passwordRepeat'].warning = '';
    }
    newForm[name].value = value;
    setForm(newForm);
  }

  const checkIsLoginFree = async ({ login }) => {
    try {
      // let { data } = await axios.post(userApi.IS_FREE_LOGIN, { login: login });
      let { data } = await axios.get('https://699m468ak3.execute-api.us-west-2.amazonaws.com/test');
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
      return false
    }
  }


  // TODO change state add error in every items
  const formValidate = () => {
    let isValid = true;
    let formCopy = JSON.parse(JSON.stringify(form));

    if (form.password.value !== form.passwordRepeat.value) {
      isValid = false;
      formCopy.passwordRepeat.warning = 'Password mismatch';
    }

    if (form?.wif?.value && !isWifFormat({ wif: form?.wif?.value })) {
      isValid = false;
      formCopy.wif.warning = 'Wrong format';
    }

    Object.keys(formCopy).map(fieldName => {
      if (formCopy[fieldName].value.length === 0) {
        formCopy[fieldName].warning = 'Field this field';
        isValid = false
      }
    })
    setForm(formCopy);
    return isValid;
  }

  const formClear = () => {
    if (form.wif.value) {
      setForm(initialForm);
    }
    else {
      delete initialForm.wif
      setForm(initialForm);
    }
  }

  const handleSendForm = async () => {
    if (!formValidate()) {
      return;
    }

    if (!await checkIsLoginFree({ login: form.login.value })) {
      return;
    }

    let data = {};
    Object.keys(form).map(field => {
      if (field !== 'passwordRepeat') {
        data[field] = form[field].value;
      }
    });
    data = { ...data, history };
    dispatch(userActions.sendRegisterData(data));
    // formClear();
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

  return (
    <>
      <RegisterHeader />
      <div className={styles.page}>
        <div className={styles.title}>
          <h3>Register</h3>
        </div>

        {chooseTypeRegistration ?
          <>

            <div className={styles.chooseButtonWrapper}>
              <Button className="primary" onClick={() => handleChooseRegistration({ type: 'createAddress' })}>Create new Bitcoin address</Button>
            </div>
            <div className={styles.chooseButtonWrapper}>
              <Button className="clean" onClick={() => handleChooseRegistration({ type: 'haveAddress' })}>I have Bitcoin address</Button>
            </div>

          </>
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
