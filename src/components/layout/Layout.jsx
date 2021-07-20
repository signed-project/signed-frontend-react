import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import Header from './Header/Header';
import Navigation from './Navigation/Navigation';
import WelcomeSing from './WelcomeSign/WelcomeSign';
import router from '../../config/routes.config';
import styles from './layout.module.scss';

// import queryString from "query-string";
const Layout = ({ children, theme }) => {

  const [isAuthPage, setISAuthPage] = useState(false)
  const user = useSelector(state => state.user);
  // const user = { isAuth: false }
  const location = useLocation();


  useEffect(() => {
    setISAuthPage(false)
  }, [location]);

  useEffect(() => {
    if (location && (location.pathname === router.register || location.pathname === router.login)) {
      setISAuthPage(true)
    }
  }, [location])

  // style={{ height: '100%' }}
  return (
    // <div className={styles.appWrapper} >
    <div className={styles.app}>
      {theme && <Header title=' signed.移动' />}
      <main >
        {children}
      </main>
      {/* {  user.isAuth && <Navigation />} */}
      {theme && user.isAuth && <Navigation />}
      {!user.isAuth && !isAuthPage && < WelcomeSing />}
      {/* {!user.isAuth && < WelcomeSing />} */}
    </div>

    // </div >
  );
};

Layout.propTypes = {
  children: PropTypes.node,
};

export default Layout;
