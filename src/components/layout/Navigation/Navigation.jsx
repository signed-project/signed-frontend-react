
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './navigation.module.scss';

const Navigation = (props) => {
  return (
    <div className={styles.bar}>
      <Link className='nav-link' to="/">Feed</Link>
      <Link className='nav-link' to="/asfas">Search</Link>
      <Link className='nav-link' to="/asfasf">New</Link>
      <Link className='nav-link' to="/asd">Profile</Link>
      <Link className='nav-link' to="/asfas">Notification</Link>
    </div>
  );
};

export default Navigation;
