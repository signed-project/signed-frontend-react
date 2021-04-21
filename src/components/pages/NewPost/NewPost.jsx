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


const NewPost = ({ toggleTheme }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const user = useSelector(state => state.user);
  const location = useLocation();
  const { post: hash, user: sourceHash } = queryString.parse(location.search);

  const [postHash, setPostHash] = useState('')

  useEffect(() => {
    toggleTheme(false);
  }, [toggleTheme]);

  useEffect(() => {
    setPostHash(hash);
  }, [hash]);


  /**
   * use line @param e.target.style.height = 0, - to stop 
   *  growth  height when add text in one row
     */
  const handleChangeMessage = (e) => {
    const value = e.target.value;
    e.target.style.height = 0;
    e.target.style.height = `${e.target.scrollHeight}px`
    setMessage(value);
  }
  const handleSendMessage = () => {
    const post = new PostModel({
      source: user.source,
      type: postHash ? 'repost' : 'post',
      text: message,
      target: postHash ? { postHash, sourceHash } : '',
      wfi: user.wfi
    });

    const newPost = post.newPost;
    console.log('newPost', newPost);
    dispatch(postActions.sendPost(newPost));
    history.goBack();
  }


  return (
    <>
      <div className={style.backBlock}>
        <img src={icon.arrowBack} onClick={() => history.goBack()} alt="arrow back icon" />
      </div>

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
      { postHash &&
        < div className={style.repostBlockWrapper}>
          <RepostBlock postHash={postHash} />
        </div>}
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
