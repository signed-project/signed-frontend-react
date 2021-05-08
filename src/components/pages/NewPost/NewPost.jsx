import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Link, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'
import icon from '../../../assets/svg/icon';
import Avatar from '../../utils/Avatar/Avatar';
import style from './newPost.module.scss';
import Button from '../../utils/Button/Button';
import { postActions } from '../../../api/storage/post';
import { Post as PostModel } from '../../../api/models/post';
import { Media } from '../../../api/models/media';
import queryString from "query-string";
import { useLocation } from "react-router-dom";
import Post from '../../utils/Post/Post';
import RepostBlock from '../../utils/Post/RepostBlock';
import CommentBlock from '../../utils/Post/CommentBlock';
import routes from '../../../config/routes.config.js';
import InfoAuthor from '../../utils/InfoAuthor/InfoAuthor';
import Checkbox from '../../utils/Checkbox/Checkbox';
import ReplyingUser from './ReplyingUser';
import useFiles from '../../customHooks/useFiles';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.min.css";
import "swiper/components/pagination/pagination.min.css"
import "swiper/components/navigation/navigation.min.css"
import "./swiper.scss";
import SwiperCore, {
  Pagination, Navigation
} from 'swiper/core';

SwiperCore.use([Pagination, Navigation]);

// TOTO: this component too mach long need to split up it!
/**
 * @tutorial function getCommentStoryKnots(params) {} compute comments story, get only one branch, only Knots, doesn't get all comments
 * for @example user A publish post - 'aaa', user B send comment for this post, and user C send comment for post  'aaa',
 * then user D send comment for user B comment - as conclusion function get only post user A, comment user B, and! doesn't get 
 * comment user C 
 *  */

const NewPost = ({ toggleTheme }) => {
  const user = useSelector(state => state.user);
  const hashedPost = useSelector(state => state.post.hashed);
  const location = useLocation();
  const { post: hash, user: source, type } = queryString.parse(location.search);

  const { uploadFile } = useFiles();

  const history = useHistory();
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const [replyingPage, setReplyingPage] = useState(false);
  const [comments, setComments] = useState([]);
  const [uploadedImg, setUploadedImg] = useState([]);
  const [others, setOthers] = useState(false);
  const [isFullImgPrev, setIsFullImgPrev] = useState(false);
  const [firstSlide, setFirstSlide] = useState(false);

  const [post, setPost] = useState({
    type: 'post',
    hash: '',
    source: '',
    isComment: false
  });

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

  const getCommentStoryKnots = (objHashed, postHash) => {
    let commentWay = [];
    const recursion = (hash, level) => {
      if (!level) return;
      const filterComment = Object.values(objHashed).find(p => p.hash === hash);
      if (filterComment.type === 'reply' && !commentWay.find(p => p.hash === filterComment.hash)) {
        commentWay.push(filterComment);
        recursion(filterComment.target.postHash, level - 1)
      } else {
        commentWay.push(filterComment);
        return;
      }
    }
    recursion(postHash, 30);
    return commentWay;
  }

  useEffect(() => {
    if (post.hash && hashedPost) {
      const commentsKnitFlow = getCommentStoryKnots(hashedPost, post.hash);
      const commentsCheckbox = commentsKnitFlow.map(comment => {
        comment.isMention = false
        return comment;
      }
      )
      setComments(commentsCheckbox);
    }

  }, [post, hashedPost]);


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

  const getMentions = () => {
    const mentions = [];
    comments.map(post => {
      if (post.isMention) {
        mentions.push(post.source)
      }
    })
    return mentions;
  }

  const handlePublicPost = async () => {
    if (post.type === 'reply' && !replyingPage) {
      setReplyingPage(true)
      return;
    }
    const mentions = getMentions();


    const attachments = await Promise.all(uploadedImg.map(async (val) => {
      const media = new Media({ type: val.file.type });
      const newMedia = media.newMedia;
      const type = newMedia.contentType
      await uploadFile(val.file, newMedia.hash);
      return newMedia
    }));

    const postInstance = new PostModel({
      source: user.source,
      type: post.type,
      text: message,
      target: post.hash ? { postHash: post.hash, sourceHash: post.source } : '',
      mentions: mentions?.length ? mentions : '',
      attachments: attachments.length > 0 ? attachments : '',
      wfi: user.wfi
    });

    const newPost = postInstance.newPost;
    dispatch(postActions.sendPost(newPost));
    history.push(routes.feed);
  }


  const renderComments = comments.slice().reverse().map((post, i) =>
  (
    <CommentBlock
      key={i}
      type={post.type}
      img={post?.source?.avatar?.hash}
      name={post.source?.name}
      text={post.text}
      createdAt={post.createdAt}
    />
  ));

  const handleOthersMention = (e) => {
    console.log('handleOthersMention');
    const isChecked = e.target.checked;
    const newComments = comments.map((post, i) => {
      if (i > 0) {
        post.isMention = isChecked;
      }
      return post;
    })
    setOthers(isChecked);
    setComments(newComments);
  };

  const handleMention = (e) => {
    const name = e.target.name;
    const isChecked = e.target.checked;
    const newComments = comments.map(post => {
      if (post.hash === name) {
        post.isMention = isChecked;
      }
      return post;
    })
    setComments(newComments);
  }

  const renderReplyingUser = comments.map((post, i) => {
    if (i > 0) {
      console.log('renderReplyingUser');
      return (
        <ReplyingUser key={i} name={post.source.name} checked={post.isMention} checkBoxName={post.hash} onChange={handleMention} />
      )
    }
  }
  );

  const handleChangeFile = (e) => {
    // await uploadFile(e.target.files[0]);
    let reader = new FileReader();
    let file = e.target.files[0];
    const newUploadedImg = uploadedImg.slice();
    reader.onloadend = () => {
      const filePrev = {
        file: file,
        imagePreviewUrl: reader.result
      }

      newUploadedImg.push(filePrev);
      setUploadedImg((prev) => {
        return [...prev, filePrev]
      }
      );
    }
    reader.readAsDataURL(file);
  }


  const handleFullSlider = (i) => {
    setIsFullImgPrev(true)
    setFirstSlide(i)
  }


  const handleDeleteImgPreview = (i) => {
    const newUploadedImg = uploadedImg.filter((img, index) => index !== i);
    setUploadedImg(newUploadedImg);
    if (newUploadedImg.length === 0) {
      setIsFullImgPrev(false)
    }
  }

  const renderImgPrev = () => {
    let smallPreviewImg = [];
    if (uploadedImg.length > 1) {

      smallPreviewImg = uploadedImg.slice().map((file, i) => {
        if (i === 0) {
          return
        }
        if (i === 3 && uploadedImg.length > 4) {
          return (
            <div className={style.impPreviewShowMore} onClick={() => handleFullSlider(4)} key={i} ><p>{`+${uploadedImg.length}`}</p></div >
          )
        }
        else if (i <= 3) {
          return (
            <div className={style.imgSmallWrapper} key={i}>
              <img src={file?.imagePreviewUrl} onClick={() => handleFullSlider(i)} alt="" className={`${style.imgPreviewSmall}`} />
              <img src={icon.del} onClick={() => handleDeleteImgPreview(i)} alt="" className={style.delIcon} />
            </div>
          )
        }
        else return;
      })
    }

    return (
      <div className={style.imgPreview}>
        <div className={style.imgPreviewWrapper}>
          <img src={icon.del} onClick={() => handleDeleteImgPreview(0)} alt="" className={style.delIcon} />
          <img src={uploadedImg[0]?.imagePreviewUrl} className={style.imgPreviewBig} alt="" onClick={() => handleFullSlider(0)} />
        </div>
        {uploadedImg.length > 0 &&
          <div className={style.smallPreview}>
            {smallPreviewImg}
          </div>}
      </div>
    )
  }


  console.log('uploadedImg', uploadedImg);

  const renderSlider = () => {
    return (
      <div className={style.sliderMain}>
        <img src={icon.cancel} alt="" className={style.cancelIcon} onClick={() => setIsFullImgPrev(false)} />
        <img src={icon.del} onClick={() => handleDeleteImgPreview(0)} alt="" className={style.delIconSlider} />
        <Swiper pagination={{
          "type": "fraction"
        }} navigation={true} initialSlide={firstSlide}  >
          {uploadedImg.map((img, i) => <SwiperSlide key={i}>
            <div className={style.sliderItem} >
              <img src={img.imagePreviewUrl} />
            </div>

          </SwiperSlide>)}

        </Swiper>


      </div>


    )
  }

  return (

    isFullImgPrev ?
      renderSlider()
      :
      (<div>

        <div className={style.backBlock}>
          {replyingPage ?
            <>
              <img src={icon.arrowBack} onClick={() => setReplyingPage(false)}
                alt="arrow back icon" />
              <span className={style.backButtonText}>Replying to</span>
            </>
            : <img src={icon.arrowBack} onClick={() => history.goBack()} alt="arrow back icon" />
          }
        </div>

        <div className={style.bodyBlock}>
          {replyingPage ?
            <div className={style.replyingBlock}>
              <ReplyingUser name={comments[0].source.name} checked={comments[0].isMention} checkBoxName={comments[0].hash} onChange={handleMention} />
              {comments.length > 1 && <div className={style.otherCheckBox}>
                <span>Others in this conversation</span>
                <div className={style.checkbox_wrapper}>
                  <Checkbox
                    onChange={handleOthersMention}
                    isChecked={others}
                    name='others'
                  />
                </div>
              </div>}
              {renderReplyingUser}
            </div>
            :
            <div className={style.newPostPage}>
              {
                post.type === 'reply' &&
                <div>
                  {renderComments}
                </div>
              }
              <div className={style.messageBlock}>
                <Avatar />
                <textarea
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
          }
          {uploadedImg.length > 0 && renderImgPrev()}
        </div>

        <div className={style.toolsBlock}>
          <div className={style.uploadBlock}>
            <input accept="image/*" id="icon-button-file"
              type="file" style={{ display: 'none' }} onChange={(e) => handleChangeFile(e)} />
            <label htmlFor="icon-button-file">
              <img src={icon.uploadImg} alt="send message icon" style={{ marginRight: '8px' }} />
            </label>
          </div>
          <div className={style.buttonWrapper}>
            <Button className="primary withIcon " onClick={handlePublicPost}>
              <img src={icon.messageSend} alt="send message icon" style={{ marginRight: '8px' }} />
            Public</Button>
          </div>
        </div>

      </div>)

  );
};

export default NewPost;
