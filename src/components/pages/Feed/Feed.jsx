import React, { useEffect, useState } from 'react';
import Post from '../../utils/Post/Post';
import style from './feed.module.scss';
import dummyPosts from '../../../dummyData/dummyPosts.json';
import dummySources from '../../../dummyData/dummySources.json';
import fromUnixTime from 'date-fns/fromUnixTime';
import format from 'date-fns/format';


const Feed = (props) => {

  const [posts, setPosts] = useState([]);

  const getSource = (adr) => {
    const res = dummySources.sources.find(src => src.address === adr);
    return res;
  }

  useEffect(() => {
    console.log('dummyPosts', dummyPosts);
    const newPosts = dummyPosts.posts.map(post => {
      post.source = getSource(post.sourceAddress);
    })
    setPosts(dummyPosts.posts);
  }, [])

  const renderPosts = posts.map((p, i) => {
    let date = '';
    if (p.created && Number(p.created) !== NaN) {
      date = format(new Date(fromUnixTime(p.created / 1000).toString()), 'PPpp')
    }

    return (
      <Post
        key={i}
        name={p.source.name}
        text={p.text}
        date={date}
        likesCount={p.likesCount}
        reportsCount={p.reportsCount}
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
