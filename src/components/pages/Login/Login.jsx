import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useHistory } from 'react-router-dom';
import RegisterHeader from '../../utils/RegisterHeader/RegisterHeader';
import styles from './login.module.scss';
import Input from '../../utils/Input/Input';
import Button from '../../utils/Button/Button';
import { routes } from '../../../config/routes.config';
import { userApi } from '../../../config/http.config';
import srp from 'secure-remote-password/client';
import { userActions } from '../../../api/storage/user';
import { postActions } from '../../../api/storage/post';
import Loader from '../../utils/loader/Loader';

const Login = ({ toggleTheme }) => {

    useEffect(() => {

        return

    }, [])

    useEffect(() => {
        toggleTheme(false);
    }, [toggleTheme]);

    const initialForm = {
        userName: { value: '', warning: '' },
        password: { value: '', warning: '' },
    };
    const history = useHistory();
    const dispatch = useDispatch();
    const [form, setForm] = useState(initialForm);
    const loginErrorState = useSelector(state => state.user.loginError);
    const isLoginProcess = useSelector(state => state.user.isLoginProcess);
    const [loginError, setLoginError] = useState(loginErrorState);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setLoginError(loginErrorState)
    }, [loginErrorState]);

    useEffect(() => {
        setIsLoading(isLoginProcess)
    }, [isLoginProcess]);

    const handleForm = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        const newForm = JSON.parse(JSON.stringify(form));
        newForm[name].value = value;
        newForm[name].warning = '';
        setForm(newForm);
        // setLoginError('');
    }


    const formValidate = () => {
        let isValid = true;
        let formCopy = JSON.parse(JSON.stringify(form));

        Object.keys(formCopy).map(fieldName => {
            if (formCopy[fieldName].value.length === 0) {
                formCopy[fieldName].warning = 'Field this field';
                isValid = false
            }
        })
        setForm(formCopy);
        return isValid;
    }

    const handleSendForm = async () => {
        if (!formValidate()) {
            return;
        }

        let data = {};
        Object.keys(form).map(field => {
            data[field] = form[field].value;
        });
        data = { ...data, history };
        dispatch(userActions.setLoginError(''));
        dispatch(userActions.sendLoginData(data));
        dispatch(userActions.setLoading(true));
        // setForm(initialForm);
    }

    return (
        <>
            <RegisterHeader />
            <div className={styles.page}>
                <div className={styles.bodyBlock}>
                    <div>
                        <h3 className={styles.title}>Log in</h3>
                    </div>
                    <div className={styles.formWrapper}>
                        <Input title={'Nickname'} type={'text'} name={'userName'} value={form.userName.value} handleChange={handleForm} warning={form.userName.warning} />
                        <Input title={'Password'} type={'password'} name={'password'} value={form.password.value} handleChange={handleForm} warning={form.password.warning} />
                        <div className={styles.loginError}>{loginError}</div>
                        <NavLink to={routes.passwordRecovery} className={styles.passForgot}> Forgot your password?</NavLink>
                        <Button className="primary fontSizeBig" isLoading={isLoading} onClick={() => { handleSendForm() }}>Log in</Button>
                    </div>
                </div>
                {/* <Loader loaderColor={true} /> */}
                <div className={styles.footer}>
                    <NavLink to={routes.register} className={styles.passForgot}> I don't have an account</NavLink>
                </div>
            </div>
        </>
    )
}

export default Login;