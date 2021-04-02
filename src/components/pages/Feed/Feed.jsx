import React, { useEffect, useState } from 'react';
import Post from '../../utils/Post/Post';
import style from './feed.module.scss';


const Feed = (props) => {

  console.log('Feed');

  return (
    <>
      <div className={style.feed}>
        <Post />
      </div>
    </>
  );
};

export default Feed;
