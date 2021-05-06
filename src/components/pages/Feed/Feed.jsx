import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Post from '../../utils/Post/Post';
import style from './feed.module.scss';

const Feed = ({ toggleTheme }) => {
  const hashedPostMap = useSelector(state => state.post.hashed);
  const stream = useSelector(state => state.post.stream);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    toggleTheme(true);
  }, [toggleTheme]);

  useEffect(() => {
    setPosts(stream);
  }, [stream]);


  // TODO : refactor change less signature 
  const renderPosts = posts.slice().reverse().map((p, i) => {
    return (
      <Post
        post={p}
        key={i}
        renderKey={i}
        type={p.type}
        name={p.source.name}
        text={p.text}
        postHash={p?.target?.postHash}
        createdAt={p.createdAt}
        likesCount={p.likesCount}
        repostsCount={p.repostsCount}
        hash={p.hash}
      />
    )
  });

  return (
    <>
      <div className={style.feed}>
        {posts && renderPosts}
      </div>
    </>
  );
};

export default Feed;
