import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useHistory } from 'react-router-dom';
import RegisterHeader from '../../utils/RegisterHeader/RegisterHeader';
import styles from './login.module.scss';
import Input from '../../utils/Input/Input';
import Button from '../../utils/Button/Button';
import routes from '../../../config/routes.config';
import { userApi } from '../../../config/http.config';
import srp from 'secure-remote-password/client';
import { userActions } from '../../../api/storage/user';


const Login = ({ toggleTheme }) => {
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
    const axios = useSelector(state => state.axios.axios);


    const handleForm = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        const newForm = JSON.parse(JSON.stringify(form));
        newForm[name].value = value;
        setForm(newForm);
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
        dispatch(userActions.sendLoginData(data))
        // setForm(initialForm);
    }

    return (
        <>
            <RegisterHeader />
            <div className={styles.page}>
                <div className={styles.bodyBlock}>
                    <div>
                        <h3 className={styles.title}>Sign in</h3>
                    </div>
                    <div className={styles.formWrapper}>
                        <Input title={'Nickname'} type={'text'} name={'userName'} value={form.userName.value} handleChange={handleForm} warning={form.userName.warning} />
                        <Input title={'Password'} type={'password'} name={'password'} value={form.password.value} handleChange={handleForm} warning={form.password.warning} />
                        <NavLink to={routes.passwordRecovery} className={styles.passForgot}> Forgot your password?</NavLink>
                        <Button className="primary" onClick={() => { handleSendForm() }}>Sign in</Button>
                    </div>
                </div>

                <div className={styles.footer}>
                    <NavLink to={routes.register} className={styles.passForgot}> I don't have an account</NavLink>
                </div>
            </div>
        </>
    )
}

export default Login;