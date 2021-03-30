import React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'react-bootstrap';

import Header from './Header/Header';
import Navigation from './Navigation/Navigation';
import Team from './Team/Team';
import Footer from './Footer/Footer';

import styles from './layout.module.scss';

const Layout = (props) => {
  const { children } = props;

  return (
    <div className={styles['wrapper']}>
      <Header title='Исследования' />
      <Navigation />
      <main className={styles['main']}>
        <Container>{children}</Container>
      </main>
      <Team />
      <Footer />
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node,
};

export default Layout;
