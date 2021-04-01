import React from 'react';
import PropTypes from 'prop-types';
import Header from './Header/Header';
import Navigation from './Navigation/Navigation';

const Layout = ({ children, theme }) => {
  console.log('theme', theme);

  return (
    <div>
      { theme && <Header title='KUKU' />}
      <main>
        {children}
      </main>
      { theme && <Navigation />}
    </div >
  );
};

Layout.propTypes = {
  children: PropTypes.node,
};

export default Layout;
