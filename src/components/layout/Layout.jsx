import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import Header from './Header/Header';
import Navigation from './Navigation/Navigation';
import WelcomeSing from './WelcomeSign/WelcomeSign';
import router from '../../config/routes.config';
import styles from './layout.module.scss';
import { inboxActions } from '../../api/storage/inbox';



const Layout = ({ children, theme }) => {
  const [isAuthPage, setISAuthPage] = useState(false)
  const { isAuth } = useSelector(state => state.user);
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuth) {
      dispatch(inboxActions.getInbox());
    }
  }, [isAuth]);

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
    <div className={styles.app}>
      {theme && <Header title='signed.移动' />}
      <main >
        {children}
      </main>
      {theme && isAuth && <Navigation />}
      {!isAuth && !isAuthPage && < WelcomeSing />}
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node,
};

export default Layout;
