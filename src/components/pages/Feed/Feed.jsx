import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Post from '../../utils/Post/Post';
import style from './feed.module.scss';
import { postActions } from '../../../api/storage/post';
import fromUnixTime from 'date-fns/fromUnixTime';
import format from 'date-fns/format';
import { Post as PostModel } from '../../../api/models/post';


const Feed = ({ toggleTheme }) => {

  const [posts, setPosts] = useState([]);
  const [sources, setSources] = useState([]);
  const [user, setUser] = useState('');
  const userStore = useSelector(state => state.user);
  const stream = useSelector(state => state.post.stream);
  const dispatch = useDispatch();

  console.log('posts_____________________________', posts);

  useEffect(() => {
    toggleTheme(true);
  }, [toggleTheme]);

  useEffect(() => {
    setUser(userStore)
  }, [userStore]);

  useEffect(() => {
    setPosts(stream);
  }, [stream])


  const handleLike = (p) => {
    const post = new PostModel({
      source: user.source,
      type: 'like',
      wfi: user.wfi,
      target: {
        "sourceHash": p.source.hash,
        "postHash": p.hash
      }
    });
    const likePost = post.getLikePost;
    dispatch(postActions.sendPost(likePost));
  }

  const renderPosts = posts.map((p, i) => {
    let date = '';
    if (p.createdAt && Number(p.createdAt) !== NaN) {
      date = format(new Date(fromUnixTime(p.createdAt / 1000).toString()), 'PPpp')
    };

    return (
      <Post
        key={i}
        type={p.type}
        name={p.source.name}
        text={p.text}
        date={date}
        likesCount={p.likesCount}
        repostsCount={p.repostsCount}
        handleLike={() => handleLike(p)}
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
