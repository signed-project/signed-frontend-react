
import React from 'react';
import { Link } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import classnames from 'classnames';

import styles from './navigation.module.scss';

const Navigation = (props) => {
  return (
    <Nav variant='pills' defaultActiveKey='/' className={classnames(styles['bar'], 'flex-column')}>
      <Link className='nav-link' to="/">Исследования</Link>
      <Link className='nav-link' to="/asfas">Карты</Link>
      <Link className='nav-link' to="/asfasf">???</Link>
      <Link className='nav-link' to="/asd">Профиль</Link>
      <Link className='nav-link' to="/asfas">Выход</Link>
    </Nav>
  );
};

export default Navigation;
