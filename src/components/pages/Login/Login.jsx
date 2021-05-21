import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import RegisterHeader from '../../utils/RegisterHeader/RegisterHeader';
import styles from './login.module.scss';
import Input from '../../utils/Input/Input';
import Button from '../../utils/Button/Button';
import routes from '../../../config/routes.config';
import { userApi } from '../../../config/http.config';

const Login = ({ toggleTheme }) => {
    useEffect(() => {
        toggleTheme(false);
    }, [toggleTheme]);

    const initialForm = {
        login: '',
        password: ''
    }

    const [form, setForm] = useState(initialForm);
    const axios = useSelector(state => state.axios.axios);


    const handleForm = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setForm(prev => ({
            ...prev,
            [name]: value
        }))

    }
    console.log('form', form);

    const handleSendForm = async () => {
        console.log('handleSendForm');
        //  TODO : validation form
        try {
            let res = await axios.post(userApi.LOGIN, form);
            console.log('res', res);
            return res;
        } catch (e) {
            console.warn('handleSendForm', e)
        }

    }

    return (
        <>
            <RegisterHeader />
            <div className={styles.page}>
                <div>
                    <h3 className={styles.title}>Login</h3>
                </div>
                <div className={styles.formWrapper}>
                    <Input title={'Nickname'} type={'text'} name={'login'} value={form.login} handleChange={handleForm} />
                    <Input title={'Password'} type={'password'} name={'password'} value={form.password} handleChange={handleForm} />
                    <NavLink to={routes.passwordRecovery} className={styles.passForgot}> Forgot your password?</NavLink>
                    <Button className="primary" onClick={() => { handleSendForm() }}>Login</Button>
                </div>
                <div className={styles.footer}>
                    <NavLink to={routes.register} className={styles.passForgot}> I don't have an account</NavLink>
                </div>
            </div>
        </>
    )
}

export default Login;