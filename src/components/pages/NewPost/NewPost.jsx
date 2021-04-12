import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import icon from '../../../assets/svg/icon';
import Avatar from '../../utils/Avatar/Avatar';
import style from './newPost.module.scss';
import Button from '../../utils/Button/Button';
import { postActions } from '../../../api/storage/post';
import { Post } from '../../../api/models/post';



const NewPost = ({ toggleTheme }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const user = useSelector(state => state.user);

  const post = new Post({
    source: user.source,
    type: 'post',
    test: message,
    wfi: user.wfi
  });

  const newPost = post.newPost;

  console.log('_____newPost_____', newPost);

  useEffect(() => {
    toggleTheme(false);
  }, [toggleTheme]);


  const handleChangeMessage = (e) => {
    const value = e.target.value;
    setMessage(value)
  }

  const handleSendMessage = () => {
    console.log('handleSendMessage');
    const post = {};
    dispatch(postActions.sendPost({ text: '2i2jjfdalksdfjkl;sfd;jklsfdjkl' }));
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
