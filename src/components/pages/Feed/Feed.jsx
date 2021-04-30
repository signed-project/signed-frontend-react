import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Post from '../../utils/Post/Post';
import style from './feed.module.scss';
import { postActions } from '../../../api/storage/post';
import { useHistory } from "react-router-dom";
import routes from '../../../config/routes.config.js';
import { Post as PostModel } from '../../../api/models/post';

/* const handleLike = ({ p, user, hashMap, dispatch, action }) => {
  let data;
  if (p.type === 'post' || p.type === 'reply') {
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
    const postData = hashMap[p?.target?.postHash];
    data = {
      ...postData,
      type: 'like',
      wfi: user.wfi,
      target: {
        sourceHash: postData.source.hash,
        postHash: postData.hash
      }
    }
  };
  const post = new PostModel(data);
  const likePost = post.newPost;
  dispatch(postActions.sendPost(likePost));
};
*/

const Feed = ({ toggleTheme }) => {
  const hashedPostMap = useSelector(state => state.post.hashed);
  const [posts, setPosts] = useState([]);
  const [postHash, setPostHash] = useState();
  const [user, setUser] = useState('');
  const userStore = useSelector(state => state.user);
  const stream = useSelector(state => state.post.stream);
  const dispatch = useDispatch();
  let history = useHistory();


  useEffect(() => {
    toggleTheme(true);
  }, [toggleTheme]);

  useEffect(() => {
    setUser(userStore)
  }, [userStore]);

  useEffect(() => {
    setPostHash(hashedPostMap)
  }, [hashedPostMap]);

  useEffect(() => {
    setPosts(stream);
  }, [stream]);

  const handleLike = (p) => {
    let data;
    if (p.type === 'post' || p.type === 'reply') {
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
      const postData = hashedPostMap[p?.target?.postHash];
      data = {
        ...postData,
        type: 'like',
        wfi: user.wfi,
        target: {
          sourceHash: postData.source.hash,
          postHash: postData.hash
        }
      }
    };
    const post = new PostModel(data);
    const likePost = post.newPost;
    dispatch(postActions.sendPost(likePost));
  };

  const handleRepost = (p) => {
    let sourcePost
    let sourceAddress
    if (p.type === 'post' || p.type === 'reply') {
      sourcePost = p.hash;
      sourceAddress = p.source.address;
    } else {
      sourcePost = p.target.postHash;
      sourceAddress = p.target.sourceHash;
    }
    const type = 'repost';
    history.push(`${routes.repost}?post=${sourcePost}&user=${sourceAddress}&type=${type}`);
  };

  const handleReply = (p) => {
    let sourcePost
    let sourceAddress
    if (p.type === 'post' || p.type === 'reply' || p.type === 'repost') {
      sourcePost = p.hash;
      sourceAddress = p.source.address;
    } else {
      sourcePost = p.target.postHash;
      sourceAddress = p.target.sourceHash;
    }
    const type = 'reply';
    history.push(`${routes.repost}?post=${sourcePost}&user=${sourceAddress}&type=${type}`);
  }


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
        handleLike={handleLike}
        handleRepost={handleRepost}
        handleReply={handleReply}
        // handleLike={() => handleLike({ p: p, user, hashMap: hashedPostMap, dispatch, action: postActions.sendPost })}
        // handleRepost={() => handleRepost({ p, history })}
        // handleReply={() => handleReply({ p, history })}
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
