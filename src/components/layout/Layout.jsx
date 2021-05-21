import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import Header from './Header/Header';
import Navigation from './Navigation/Navigation';
import WelcomeSing from './WelcomeSing/WelcomeSing';
import router from '../../config/routes.config';

// import queryString from "query-string";
const Layout = ({ children, theme }) => {

  const [isAuthPage, setISAuthPage] = useState(false)
  const user = useSelector(state => state.user);
  const location = useLocation();

  useEffect(() => {
    if (location && (location.pathname === router.register || location.pathname === router.login)) {
      console.log('-----------hire====================');
      setISAuthPage(true)
    }
  }, [location])

  console.log('location', location);

  // const {
  //   post: hash,
  //   user: source,
  //   type,
  //   edit,
  // } = queryString.parse(location.search);


  return (
    <div>
      { theme && <Header title='KUKU' />}
      <main >
        {children}
      </main>
      { theme && user.isAuth && <Navigation />}
      {!user.isAuth && !isAuthPage && < WelcomeSing />}
    </div >
  );
};

Layout.propTypes = {
  children: PropTypes.node,
};

export default Layout;
