import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Post from '../../utils/Post/Post';
import style from './feed.module.scss';
// import dummyPosts from '../../../dummyData/dummyPosts';
// import dummySources from '../../../dummyData/dummySources';
import fromUnixTime from 'date-fns/fromUnixTime';
import format from 'date-fns/format';
import getUniqId from '../../../libs/UniqueIdGenerator';

const Feed = ({ toggleTheme }) => {

  const [posts, setPosts] = useState([]);
  const [sources, setSources] = useState([]);
  const [user, setUser] = useState('');
  const userStore = useSelector(state => state.user);
  const stream = useSelector(state => state.post.stream);

  console.log('userStore', stream);

  console.log('________________posts__________________', posts);

  useEffect(() => {
    toggleTheme(true);
  }, [toggleTheme]);

  useEffect(() => {
    setUser(userStore)
  }, [userStore]);


  const getPost = (id) => {
    const res = posts.find(post => post.uniqueKey === id);
    return res;
  }

  useEffect(() => {
    console.log('stream____________________________', stream);
    setPosts(stream);
  }, [stream])

 

  const renderPosts = posts.map((p, i) => {

    console.log('p', p);

    let date = '';
    if (p.createdAt && Number(p.createdAt) !== NaN) {
      date = format(new Date(fromUnixTime(p.createdAt / 1000).toString()), 'PPpp')
    }

    return (
      <Post
        key={i}
        type={p.type}
        name={p.source.name}
        text={p.text}
        date={date}
        likesCount={p.likesCount}
        reportsCount={p.reportsCount}
        // handleLike={() => handleLike(p)}
      />
    )
  })

  return (
    <>
      <div className={style.feed}>
        {posts && renderPosts}
      </div>
    </>
  );
};

export default Feed;
