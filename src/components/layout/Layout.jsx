import React from 'react';
import PropTypes from 'prop-types';

import Header from './Header/Header';
import Navigation from './Navigation/Navigation';
import styles from './layout.module.scss';

const Layout = (props) => {
  const { children } = props;

  return (
    <div>
      <Header title='KUKU' />
      <main>
        {children}
      </main>
      <Navigation />
    </div >
  );
};

Layout.propTypes = {
  children: PropTypes.node,
};

export default Layout;
