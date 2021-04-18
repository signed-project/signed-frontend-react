import React from 'react';
import { connect } from 'react-redux';
import styles from './header.module.scss';

const Header = ({ title }) => {
  return (
    <div className={styles.header}>
      <h5 className={styles.title}>{title}</h5>
    </div >
  );
};

export default Header;
