import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import icon from '../../../assets/svg/icon';
import Avatar from '../../utils/Avatar/Avatar';
import style from './newPost.module.scss';
import Button from '../../utils/Button/Button';
import { postActions } from '../../../api/storage/post';
import { Post as PostModel } from '../../../api/models/post';
import queryString from "query-string";
import { useLocation } from "react-router-dom";
import Post from '../../utils/Post/Post';
import RepostBlock from '../../utils/Post/RepostBlock';
import CommentBlock from '../../utils/Post/CommentBlock';
import { Link, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'

const NewPost = ({ toggleTheme }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const user = useSelector(state => state.user);
  const hashedPost = useSelector(state => state.post.hashed);
  const location = useLocation();
  const { post: hash, user: source, type } = queryString.parse(location.search);

  const [post, setPost] = useState({
    type: 'post',
    hash: '',
    source: '',
    isComment: false
  });

  const [previousComments, setPreviousComments] = useState('')

  useEffect(() => {
    scroll.scrollToBottom();
    scroll.scrollMore(1000);
  }, []);

  useEffect(() => {
    toggleTheme(false);
  }, [toggleTheme]);

  useEffect(() => {
    setPost(prev => ({
      ...prev,
      type,
      hash,
      source,
    }))

  }, [hash, source, type]);


  /**
   *   @param  e.target.style.height = 0, - to stop 
   *  growth  height when add text in one row
     */
  const handleChangeMessage = (e) => {
    const value = e.target.value;
    e.target.style.height = 0;
    e.target.style.height = `${e.target.scrollHeight}px`;
    scroll.scrollToBottom();

    setMessage(value);
  };

  // A7SL425X5dP8XEhC7CMsDYz9XEwfwWrP6BwZud28vgrr

  const handleSendMessage = () => {
    const postInstance = new PostModel({
      source: user.source,
      type: post.type,
      text: message,
      target: post.hash ? { postHash: post.hash, sourceHash: post.source } : '',
      wfi: user.wfi
    });

    // const postInstanceLevel = new PostModel({
    //   source: user.source,
    //   type: 'reply',
    //   text: 'test test test',
    //   target: { postHash: 'GRYxN5VrnH11sv8LKGZJ8ZRacDM9CAFQVRrPdzEatD4G', sourceHash: '19FRhaywUUpvMxUMSxgpTvc44Bj9VFd3BT' },
    //   wfi: user.wfi
    // });

    const newPost = postInstance.newPost;
    // const newPostLevel = postInstanceLevel.newPost;
    dispatch(postActions.sendPost(newPost));
    // dispatch(postActions.sendPost(newPostLevel));
    history.goBack();
  }


  const renderComments = () => {
    let commentWay = [];
    const recursion = (hash, level) => {
      if (!level) return;
      console.log('level', level);
      const filterComment = Object.values(hashedPost).find(p => p.hash === hash);
      console.log('filterComment', filterComment);
      if (filterComment.type === 'reply' && !commentWay.find(p => p.hash === filterComment.hash)) {
        commentWay.push(filterComment);
        recursion(filterComment.target.postHash, level - 1)
      } else {
        console.log('filterComment.type', filterComment.type);
        commentWay.push(filterComment);
        return;
      }
    }
    recursion(post.hash, 30);
    console.log('commentWay', commentWay);

    return (
      commentWay.slice().reverse().map(post => {
        return (
          <CommentBlock
            img={post?.source?.avatar?.hash}
            name={post.source?.name}
            text={post.text}
            createdAt={post.createdAt}
            mentions={post.mentions}
          />
        )
      })

    )
  }

  return (
    <>
      <div className={style.backBlock}>
        <img src={icon.arrowBack} onClick={() => history.goBack()} alt="arrow back icon" />
      </div>
      <div className={style.bodyBlock}>
        {post.type === 'reply' &&
          <div >
            {renderComments()}
          </div>}
        <div className={style.messageBlock}>
          <Avatar />
          <textarea
            style={{ overflow: 'hidden', outline: 'none' }}
            name='newPost'
            value={message}
            onChange={handleChangeMessage}
            placeholder='Enter text...'
            className={style.textarea}
          ></textarea>
        </div>
        {post?.type === 'repost' &&
          <div className={style.repostBlockWrapper}>
            <RepostBlock postHash={post.hash} />
          </div>}


      </div>
      <div className={style.toolsBlock}>
        <div>
        </div>
        <div className={style.buttonWrapper}>
          <Button className="primary withIcon " onClick={handleSendMessage}>
            <img src={icon.messageSend} alt="send message icon" style={{ marginRight: '8px' }} />
            Public</Button>
        </div>
      </div>

    </>
  );
};

export default NewPost;
