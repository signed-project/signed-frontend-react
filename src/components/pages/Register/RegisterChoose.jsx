import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useHistory } from 'react-router-dom';
import RegisterHeader from '../../utils/RegisterHeader/RegisterHeader';
import styles from './register.module.scss';
import Input from '../../utils/Input/Input';
import Button from '../../utils/Button/Button';
import { routes } from '../../../config/routes.config';
import { userApi } from '../../../config/http.config';
import srp from 'secure-remote-password/client';
import { getRegisterUserData } from '../../../libs/signature.js';
import { userActions } from '../../../api/storage/user';

const Register = ({ toggleTheme }) => {

    const history = useHistory();
    const dispatch = useDispatch();
    useEffect(() => {
        toggleTheme(false);
    }, [toggleTheme]);

    const initialForm = {
        login: { value: '', warning: '' },
        password: { value: '', warning: '' },
        passwordRepeat: { value: '', warning: '' }
    }

    const axios = useSelector(state => state.axios.axios);
    const [form, setForm] = useState(initialForm)

    const handleForm = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setForm(prev => {
            const itemForm = form[name];
            return {
                ...prev,
                [name]: {
                    ...itemForm,
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
            wif: wif,
        };
        dispatch(userActions.setUser(data));
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('accessToken', accessToken);
        history.push(routes.feed);
    }


    const handleSendForm = async () => {
        //  TODO : validation form
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

        try {
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
        }
    }


    return (
        <>
            <RegisterHeader />
            <div className={styles.page}>
                <div>
                    <h3 className={styles.title}>Register</h3>
                </div>
                <div className={styles.formWrapper}>

                </div>
                <div className={styles.footer}>
                    <NavLink to={routes.login} className={styles.passForgot}> I don't have an account</NavLink>
                </div>
            </div>
        </>
    );
};

export default Register;
