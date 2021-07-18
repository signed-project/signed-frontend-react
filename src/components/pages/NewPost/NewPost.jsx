import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import icon from "../../../assets/svg/icon";
// import icon from "@/assets/svg/icon";
import logo from "./logo.svg";

import Avatar from "../../utils/Avatar/Avatar";
import style from "./newPost.module.scss";
import Button from "../../utils/Button/Button";
import { postActions } from "../../../api/storage/post";
import { Post as PostModel } from "../../../api/models/post";
import { Media } from "../../../api/models/media";
import queryString from "query-string";
import { useLocation } from "react-router-dom";
import RepostBlock from "../../utils/Post/RepostBlock";
import CommentBlock from "../../utils/Post/CommentBlock";
import routes from "../../../config/routes.config.js";
import Checkbox from "../../utils/Checkbox/Checkbox";
import ReplyingUser from "./ReplyingUser";
import useFiles from "../../customHooks/useFiles";
import Preview from "../../utils/Preview/Preview";
import Slider from "../../utils/Slider/Slider";
import getImgArr from "../../customHooks/getImgSources";
import { set } from "date-fns/esm";
import { setLoading } from "../../../api/storage/user/actions";

// TOTO: this component too mach long need to split up it!
/**
 * @tutorial function getCommentStoryKnots(params) {} compute comments story, get only one branch, only Knots, doesn't get all comments
 * for @example user A publish post - 'aaa', user B send comment for this post, and user C send comment for post  'aaa',
 * then user D send comment for user B comment - as conclusion function get only post user A, comment user B, and! doesn't get
 * comment user C
 *  */

const NewPost = ({ toggleTheme }) => {
  const user = useSelector((state) => state.user);
  const hashedPost = useSelector((state) => state.post.hashed);
  const location = useLocation();
  const {
    post: hash,
    user: source,
    type,
    edit,
  } = queryString.parse(location.search);

  const { uploadFile } = useFiles();
  const isLoginProcess = useSelector((state) => state.user.isLoginProcess);
  const history = useHistory();
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const [replyingPage, setReplyingPage] = useState(false);
  const [comments, setComments] = useState([]);
  const [uploadedImg, setUploadedImg] = useState([]);
  const [others, setOthers] = useState(false);
  const [isFullImgPrev, setIsFullImgPrev] = useState(false);
  const [firstSlide, setFirstSlide] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [post, setPost] = useState({
    type: "post",
    hash: "",
    source: "",
    isComment: false,
  });

  useEffect(() => {
    setIsLoading(isLoginProcess);
  }, [isLoginProcess]);

  useEffect(() => {
    scroll.scrollToBottom();
    scroll.scrollMore(1000);
  }, []);

  useEffect(() => {
    toggleTheme(false);
  }, [toggleTheme]);

  useEffect(() => {
    setPost((prev) => ({
      ...prev,
      type,
      target: { sourceHash: source, postHash: hash },
    }));
  }, [hash, source, type]);

  const getCommentStoryKnots = (objHashed, postHash) => {
    let commentWay = [];
    const recursion = (hash, level) => {
      if (!level) return;
      const filterComment = Object.values(objHashed).find(
        (p) => p.hash === hash
      );
      if (
        filterComment?.type === "reply" &&
        !commentWay.find((p) => p.hash === filterComment.hash)
      ) {
        commentWay.push(filterComment);
        recursion(filterComment.target.postHash, level - 1);
      } else {
        commentWay.push(filterComment);
        return;
      }
    };
    recursion(postHash, 30);
    return commentWay;
  };

  useEffect(() => {
    if (post?.target?.postHash && hashedPost) {
      const commentsKnitFlow = getCommentStoryKnots(
        hashedPost,
        post.target?.postHash
      );
      const commentsCheckbox = commentsKnitFlow.map((comment) => {
        if (comment) {
          comment.isMention = false;
          return comment;
        }
      });
      setComments(commentsCheckbox);
    }
  }, [post, hashedPost]);

  useEffect(() => {
    if (edit && hashedPost) {
      const editedPost = hashedPost[edit];
      console.log("editedPost", editedPost);
      if (editedPost?.attachments) {
        const imgSours = getImgArr(editedPost?.attachments);
        setUploadedImg(imgSours);
      }
      setMessage(editedPost?.text);

      setPost((prev) => ({
        ...editedPost,
      }));
    }
  }, [edit, hashedPost]);

  /**
   *    /*   let reader = new FileReader();
         reader.onloadend = () => {
             console.log('onloadend', reader.result);
             const filePrev = {
               file: file,
               imagePreviewUrl: reader.result
             }
             newUploadedImg.push(filePrev);
             reader.readAsDataURL(file);
           }  */

  /**
   *
   *   @param  e.target.style.height = 0, - to stop
   *  growth  height when add text in one row
   */

  const handleChangeMessage = (e) => {
    const value = e.target.value;
    e.target.style.height = 0;
    e.target.style.height = `${e.target.scrollHeight}px`;
    // scroll.scrollToBottom();
    setMessage(value);
  };

  const getMentions = () => {
    const mentions = [];
    comments.map((post) => {
      if (post.isMention) {
        mentions.push(post.source);
      }
      return post;
    });
    return mentions;
  };

  const handlePublicPost = () => {
    if (isLoading) {
      return;
    }
    if (post.type === "reply" && !replyingPage) {
      setReplyingPage(true);
      return;
    }
    const mentions = getMentions();
    (async () => {
      const attachments = await Promise.all(
        uploadedImg.map(async (val) => {
          if (val.file) {
            let data, newMedia;
            try {
              ({ data } = await uploadFile(val.file));
              const media = new Media({
                contentType: data.contentType,
                hash: data.hash,
              });
              newMedia = media.newMedia;
            } catch (e) {
              console.warn("[NewPost][attachments]", e);
            }
            return newMedia;
          } else {
            delete val.imagePreviewUrl;
            return val;
          }
        })
      );

      const postInstance = new PostModel({
        id: post.id ? post.id : "",
        source: user.source,
        type: post.type,
        text: message,
        target: {
          postHash: post.target?.postHash ? post.target?.postHash : "",
          sourceHash: post.target?.sourceHash ? post.target?.sourceHash : "",
        },
        // target: post.hash ? { postHash: post.hash, sourceHash: post.source } : "",
        mentions: mentions?.length ? mentions : "",
        attachments: attachments.length > 0 ? attachments : "",
        wif: user.wif,
      });

      const newPost = postInstance.newPost;
      setMessage("");
      setUploadedImg([]);
      dispatch(postActions.sendPost(newPost));
      history.push(routes.feed);
    })();
  };

  const renderComments = comments
    .slice()
    .reverse()
    .map((post, i) => (
      <CommentBlock
        key={i}
        type={post.type}
        img={post?.source?.avatar?.hash}
        name={post.source?.name}
        text={post.text}
        createdAt={post.createdAt}
        post={post}
      />
    ));

  const handleOthersMention = (e) => {
    const isChecked = e.target.checked;
    const newComments = comments.map((post, i) => {
      if (i > 0) {
        post.isMention = isChecked;
      }
      return post;
    });
    setOthers(isChecked);
    setComments(newComments);
  };

  const handleMention = (e) => {
    const name = e.target.name;
    const isChecked = e.target.checked;
    const newComments = comments.map((post) => {
      if (post.hash === name) {
        post.isMention = isChecked;
      }
      return post;
    });
    setComments(newComments);
  };

  const renderReplyingUser = comments.map((post, i) => {
    if (i > 0) {
      return (
        <ReplyingUser
          key={i}
          name={post.source.name}
          checked={post.isMention}
          checkBoxName={post.hash}
          onChange={handleMention}
        />
      );
    }
    return "";
  });

  const handleChangeFile = (e) => {
    setUploadedImg([]);
    let filesArr = e.target.files;
    const newUploadedImg = uploadedImg.slice();

    [...filesArr].map((file) => {
      const filePrev = {
        file: file,
        imagePreviewUrl: URL.createObjectURL(file),
      };
      newUploadedImg.push(filePrev);
      return file;
    });
    setUploadedImg(newUploadedImg);
  };

  const handleFullSlider = (i) => {
    setIsFullImgPrev(true);
    setFirstSlide(i);
  };

  const handleDeleteImgPreview = (i) => {
    const newUploadedImg = uploadedImg.filter((img, index) => index !== i);

    setUploadedImg(newUploadedImg);
    if (newUploadedImg.length === 0) {
      setIsFullImgPrev(false);
    }
  };

  return isFullImgPrev ? (
    <Slider
      uploadImgArr={uploadedImg}
      firstSlide={firstSlide}
      setIsFullImgPrev={setIsFullImgPrev}
      handleDeleteImgPreview={handleDeleteImgPreview}
    />
  ) : (
    <>
      <div className={style.backBlock}>
        {replyingPage ? (
          <>
            <img
              src={icon.arrowBack}
              onClick={() => setReplyingPage(false)}
              alt="arrow back icon"
            />
            <span className={style.backButtonText}>Replying to</span>
          </>
        ) : (
          <img
            src={icon.arrowBack}
            onClick={() => history.push(routes.feed)}
            alt="arrow back icon"
          />
        )}
      </div>

      <div className={style.bodyBlock}>
        {
          // replyingPage
          replyingPage ? (
            <div className={style.replyingBlock}>
              <ReplyingUser
                name={comments[0].source.name}
                checked={comments[0].isMention}
                checkBoxName={comments[0].hash}
                onChange={handleMention}
              />
              {comments.length > 1 && (
                <div className={style.otherCheckBox}>
                  <span>Others in this conversation</span>
                  <div className={style.checkbox_wrapper}>
                    <Checkbox
                      onChange={handleOthersMention}
                      isChecked={others}
                      name="others"
                    />
                  </div>
                </div>
              )}
              {renderReplyingUser}
            </div>
          ) : (
            <div className={style.newPostPage}>
              {post.type === "reply" && comments && <div>{renderComments}</div>}
              <div className={style.messageBlock}>
                <Avatar avatar={post.source.avatar} />
                <textarea
                  value={message}
                  onChange={handleChangeMessage}
                  placeholder="Enter text..."
                  className={style.textarea}
                ></textarea>
              </div>

              {post?.type === "repost" && (
                <div className={style.repostBlockWrapper}>
                  <RepostBlock postHash={post.target?.postHash} />
                </div>
              )}
            </div>
          )
        }
        {uploadedImg.length > 0 && !replyingPage && (
          <div className={style.wrapperPreview}>
            <Preview
              uploadImgArr={uploadedImg}
              handleFullSlider={handleFullSlider}
              handleDeleteImgPreview={handleDeleteImgPreview}
            />
          </div>
        )}
      </div>

      <div className={style.toolsBlock}>
        {!replyingPage && (
          <div className={style.uploadBlock}>
            <input
              accept="image/*"
              multiple
              id="icon-button-file"
              type="file"
              style={{ display: "none" }}
              onChange={(e) => handleChangeFile(e)}
            />
            <label htmlFor="icon-button-file">
              <img
                src={icon.uploadImg}
                alt="send message icon"
                style={{ marginRight: "8px" }}
              />
            </label>
          </div>
        )}
        {!replyingPage && (
          <div className={style.buttonWrapper}>
            <Button
              isLoading={isLoading}
              disabled={isLoading}
              className="primary withIcon"
              onClick={() => {
                post?.type !== "reply" && !replyingPage && setIsLoading(true);
                handlePublicPost();
              }}
            >
              <img
                src={icon.messageSend}
                alt="send message icon"
                style={{ marginRight: "8px" }}
              />
              Publish
            </Button>
          </div>
        )}
        {replyingPage && (
          <div className={style.buttonWrapperDone}>
            <Button
              isLoading={isLoading}
              disabled={isLoading}
              className="primary fullWidth"
              onClick={() => {
                handlePublicPost();
              }}
            >
              Done
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default NewPost;
