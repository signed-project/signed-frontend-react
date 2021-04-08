import React, { useEffect, useState } from 'react';
import icon from '../../../assets/svg/icon';
import { useHistory } from 'react-router-dom';
import Avatar from '../../utils/Avatar/Avatar';
import style from './newPost.module.scss';

const NewPost = ({ toggleTheme }) => {

  useEffect(() => {
    toggleTheme(false);
  }, [toggleTheme]);

  const history = useHistory();

  return (
    <>
      <div className={style.backBlock}>
        <img src={icon.arrowBackIcon} onClick={() => history.goBack()} alt="arrow back icon" />
      </div>

      <Avatar />
    </>
  );
};

export default NewPost;
