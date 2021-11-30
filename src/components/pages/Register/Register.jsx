import { useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useHistory } from 'react-router-dom';
import RegisterHeader from '../../utils/RegisterHeader/RegisterHeader';
import styles from './register.module.scss';
import Input from '../../utils/Input/Input';
import Button from '../../utils/Button/Button';
import { routes } from '../../../config/routes.config';
import { userApi } from '../../../config/http.config';
import { userActions } from '../../../api/storage/user';
import { isWifFormat } from '../../../libs/signature';
import ChangeUserPic from '../../utils/ChangeUserPic/ChangeUserPic';
import userPlaceHolder from "../../../assets/svg/icon/userPlaceHolder.jpg"
import useFiles from "../../customHooks/useFiles";
import { LayoutContext } from '../../layout/LayoutProvider';


const Register = () => {
  const layoutContext = useContext(LayoutContext);

  const typeMap = {
    createAddress: 'createAddress',
    haveAddress: 'haveAddress'
  };
  const avatarInitial = {
    file: '',
    imageSrc: userPlaceHolder,
  }
  const initialForm = {
    wif: { value: '', warning: '' },
    userName: { value: '', warning: '' },
    publicName: { value: '', warning: '' },
    password: { value: '', warning: '' },
    passwordRepeat: { value: '', warning: '' }
  }

  const history = useHistory();
  const dispatch = useDispatch();

  const axios = useSelector(state => state.axios.axios);
  const isLoginProcess = useSelector(state => state.user.isLoginProcess);

  const [form, setForm] = useState(initialForm);
  const [chooseTypeRegistration, setChooseTypeRegistration] = useState(true);
  const [typeRegistration, setTypeRegistration] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [avatar, setAvatar] = useState(avatarInitial);

  const { uploadFile } = useFiles();

  useEffect(() => {
    layoutContext.toggleTheme(false);
  }, [layoutContext]);

  useEffect(() => {
    setIsLoading(isLoginProcess);
    if (isLoginProcess) {
      setChooseTypeRegistration(false)
    };
  }, [isLoginProcess]);



  useEffect(() => {
    if (typeRegistration === typeMap.createAddress) {
      setForm(prev => {
        delete prev.wif;
        return ({
          ...prev
        })
      })
    }

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

  const handleChangeFile = (e) => {
    let file = e.target.files[0];
    const filePrev = {
      file: file,
      imageSrc: URL.createObjectURL(file),
    };
    setAvatar(filePrev);
  };

  const checkIsLoginFree = async ({ userName }) => {
    try {
      let { data } = await axios.post(userApi.CHECK_LOGIN, { userName });
      const isFreeLogin = data?.isFreeLogin;
      let warningMessage = '';
      if (isFreeLogin === false) {
        warningMessage = 'The login you entered is already in use';
        dispatch(userActions.setLoading(false));
      }
      setForm((prev) => {
        const userNameItem = form['userName'];
        return ({
          ...prev,
          userName: { ...userNameItem, warning: warningMessage }
        })
      });
      return isFreeLogin;
    } catch (e) {
      console.warn('[checkIsLoginFree]', e);
      return false
    }
  }


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
    let uploadAvatarData;
    if (!formValidate()) {
      return;
    }
    dispatch(userActions.setLoading(true));

    if (!await checkIsLoginFree({ userName: form.userName.value })) {
      dispatch(userActions.setLoading(false));
      return;
    }

    if (avatar.file) {
      try {
        ({ data: uploadAvatarData } = await uploadFile(avatar.file));
      } catch (e) {
        console.warn("[handleSendForm][uploadFile]", e);
      }
    }

    let data = {};
    Object.keys(form).map(field => {
      if (field !== 'passwordRepeat') {
        data[field] = form[field].value;
      }
    });

    data = { ...data, history, avatar: uploadAvatarData ? uploadAvatarData : '' };

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
        <div className={styles.bodyBlock}>
          <div className={styles.title}>
            <h3>Register</h3>
          </div>

          {chooseTypeRegistration ?
            <>
              <div className={styles.chooseButtonWrapper}>
                <Button className="primary fontSizeBig" onClick={() => handleChooseRegistration({ type: 'createAddress' })}>Create new Bitcoin address</Button>
              </div>
              <div className={styles.chooseButtonWrapper}>
                <Button className="clean fontSizeBig" onClick={() => handleChooseRegistration({ type: 'haveAddress' })}>I have Bitcoin address</Button>
              </div>

            </>
            : <form>
              <div className={styles.formWrapper}>
                <ChangeUserPic srcData={avatar.imageSrc} handleChangeFile={handleChangeFile} />
                {typeRegistration === typeMap.haveAddress && <Input title={'Enter Bitcoin address'} name={'wif'} warning={form.wif.warning} type={'text'} handleChange={handleForm} value={form.wif.value} />}
                <Input title={'Public name'} name={'publicName'} warning={form.publicName.warning} type={'text'} handleChange={handleForm} value={form.publicName.value} />
                <Input title={'User name'} name={'userName'} warning={form.userName.warning} type={'text'} handleChange={handleForm} value={form.userName.value} />
                <Input title={'Password'} type={'password'} warning={form.password.warning} name={'password'} handleChange={handleForm} value={form.password.value} />
                <Input title={'Repeat password'} type={'password'} warning={form.passwordRepeat.warning} name={'passwordRepeat'} handleChange={handleForm} value={form.passwordRepeat.value} />
                <NavLink to={routes.passwordRecovery} className={styles.passForgot}> Forgot your password?</NavLink>
                <Button className="primary fontSizeBig" isLoading={isLoading} onClick={() => { handleSendForm() }}>Register</Button>
              </div>
            </form>
          }
        </div>
        <div className={styles.footer}>
          <NavLink to={routes.login} className={styles.passForgot}> I have an account</NavLink>
        </div>
      </div>
    </>
  );
};

export default Register;
