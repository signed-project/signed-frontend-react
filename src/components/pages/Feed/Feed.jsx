import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Post from '../../utils/Post/Post';
import style from './feed.module.scss';
import { postActions } from '../../../api/storage/post';
import { useHistory } from "react-router-dom";
import routes from '../../../config/routes.config.js';
import { Post as PostModel } from '../../../api/models/post';
import { useTargetPost } from '../../utils/Post/Post';

const Feed = ({ toggleTheme }) => {

  const hashedPost = useSelector(state => state.post.hashed);
  const [posts, setPosts] = useState([]);
  const [sources, setSources] = useState([]);
  const [postHash, setPostHash] = useState();
  const [user, setUser] = useState('');
  const userStore = useSelector(state => state.user);
  const stream = useSelector(state => state.post.stream);
  const dispatch = useDispatch();
  let history = useHistory();


  console.log('postHash', postHash);

  useEffect(() => {
    toggleTheme(true);
  }, [toggleTheme]);


  useEffect(() => {
    setUser(userStore)
  }, [userStore]);

  useEffect(() => {
    setPostHash(hashedPost)
  }, [hashedPost]);

  useEffect(() => {
    setPosts(stream);
  }, [stream]);

  const handleLike = (p) => {
    let data;
    if (p.type === 'post') {


      console.log('OOOOOOOOOOOOOOOOOOOOOPPPPPPPPPPPPPPPPSSSS');

      data = {
        source: user.source,
        type: 'like',
        wfi: user.wfi,
        target: {
          "sourceHash": p.source.hash,
          "postHash": p.hash
        }
      }
    }
    else {
      console.log('LLLLLLLLLLLLLLLLLLLLLLLLLLLLLIIIIIIIIIIIIIIIIIIIIIIIIKKKKKKKKKKKKEEEEEEEEEEEEEEEE');
      console.log('p?.target?.postHash_________________', p?.target?.postHash);
      console.log('postHash_________________', postHash);
      data = postHash[p?.target?.postHash];
      console.log('data_________________', data);
      debugger;
    };
    const post = new PostModel(data);
    const likePost = post.newPost;
    dispatch(postActions.sendPost(likePost));
  };



  const handleRepost = (p) => {
    const sourcePost = p.type === 'post' ? p.hash : p.target.postHash;
    const sourceAddress = p.type === 'post' ? p.source.address : p.target.sourceHash;
    // .hash, p.source.address
    history.push(`${routes.repost}?post=${sourcePost}&user=${sourceAddress}`);
  };

  const renderPosts = posts.slice().reverse().map((p, i) => {

    return (
      <Post
        key={i}
        type={p.type}
        name={p.source.name}
        text={p.text}
        postHash={p?.target?.postHash}
        createdAt={p.createdAt}
        likesCount={p.likesCount}
        repostsCount={p.repostsCount}
        handleLike={() => handleLike(p)}
        handleRepost={() => handleRepost(p)}
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
