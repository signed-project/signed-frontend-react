import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import RegisterHeader from '../../utils/RegisterHeader/RegisterHeader';
import styles from './register.module.scss';
import Input from '../../utils/Input/Input';
import Button from '../../utils/Button/Button';
import routes from '../../../config/routes.config';


const Register = ({ toggleTheme }) => {
  useEffect(() => {
    toggleTheme(false);
  }, [toggleTheme]);

  const initialForm = {
    login: '',
    password: '',
    passwordRepeat: ''
  }

  const [form, setForm] = useState(initialForm)

  const handleForm = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setForm(prev => ({
      ...prev,
      [name]: value
    }))

  }
  console.log('form', form);




  return (
    <>
      <RegisterHeader />
      <div className={styles.page}>
        <div>
          <h3 className={styles.title}>Register</h3>
        </div>
        <div className={styles.formWrapper}>
          <Input title={'Nickname'} />
          <Input title={'Password'} />
          <Input title={'Repeat password'} />
          <NavLink to={routes.passwordRecovery} className={styles.passForgot}> Forgot your password?</NavLink>
          <Button className="primary">Register</Button>
        </div>
        <div className={styles.footer}>
          <NavLink to={routes.login} className={styles.passForgot}> I don't have an account</NavLink>
        </div>
      </div>
    </>
  );
};

export default Register;
