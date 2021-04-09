
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import styles from './navigation.module.scss';
import icons from '../../../assets/svg/icon';
import routes from '../../../config/routes.config';


const NavItem = ({ to, icon, alt, title }) => {
  return (
    <>
      <NavLink className={styles.navLink} to={to}>
        <div className={styles.link}>
          <div className={styles.imgWrapper}>
            <img style={{ width: '100%' }} src={icon} alt={alt} />
          </div>
          <span className={styles.titleNav}>{title}</span>
        </div >
      </NavLink>

    </>
  )
}


const Navigation = (props) => {
  return (
    <div className={styles.bar}>
      <NavItem
        to={routes.feed}
        icon={icons.feed}
        alt={'feed icon'}
        title={'Feed'}
      />

      <NavItem
        to={routes.search}
        icon={icons.search}
        alt={'Search icon'}
        title={'Search'}
      />

      <NavItem
        to={routes.newPost}
        icon={icons.addNew}
        alt={'New post icon'}
        title={''}
      />

      <NavItem
        to={routes.profile}
        icon={icons.profile}
        alt={'Profile icon'}
        title={'Profile'}
      />
      <NavItem
        to={routes.notification}
        icon={icons.notification}
        alt={'Notification icon'}
        title={'Notification'}
      />

    </div>
  );
};

export default Navigation;
