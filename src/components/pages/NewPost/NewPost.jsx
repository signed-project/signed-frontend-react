import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import icon from "../../../assets/svg/icon";
// import icon from "@/assets/svg/icon";

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
import { routes } from "../../../config/routes.config.js";
import Checkbox from "../../utils/Checkbox/Checkbox";
import ReplyingUser from "./ReplyingUser";
import useFiles from "../../customHooks/useFiles";
import Preview from "../../utils/Preview/Preview";
import Slider from "../../utils/Slider/Slider";
import getImgArr from "../../customHooks/getImgSources";
import Post from "./../../utils/Post/Post";

import {
  getPostByHash,
  getReplyPostsForComment,
  getParentPostsForComment,
} from "./../../../api/customNpmPackage/signedLoader";
import { LayoutContext } from "../../layout/LayoutProvider";

// TOTO: this component too mach long need to split up it!
const NewPost = () => {
  const layoutContext = useContext(LayoutContext);

  const user = useSelector((state) => state.user);
  const subscribedSources = useSelector((state) => state.source.subscribed);

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
  const [openMenuHash, setOpenMenuHash] = useState(null);

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
    layoutContext.toggleTheme(false);
  }, [layoutContext]);

  useEffect(() => {
    setPost((prev) => ({
      ...prev,
      type,
      target: { sourceHash: source, postHash: hash },
    }));
  }, [hash, source, type]);

  useEffect(() => {
    const postHash = post?.target?.postHash;

    if (postHash) {
      const commentsKnitFlow = getReplyPostsForComment({
        postHashToComment: postHash,
        subscribedSources,
      });

      const commentsCheckbox = commentsKnitFlow.map((comment) => {
        if (comment) {
          comment.isMention = false;
          return comment;
        }
      });

      setComments(commentsCheckbox);
    }
  }, [post, subscribedSources]);

  useEffect(() => {
    if (edit) {
      const editedPost = getPostByHash({ hash: edit, subscribedSources });
      if (editedPost?.attachments) {
        const imgSours = getImgArr(editedPost?.attachments);
        setUploadedImg(imgSours);
      }
      setMessage(editedPost?.text);

      setPost((prev) => ({
        ...editedPost,
      }));
    }
  }, [edit, subscribedSources]);

  /**
   *    /*   let reader = new FileReader();
         reader.onloadend = () => {
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

  const getTags = (text) => {
    // let textLowerCase = text.toLowerCase();

    if (text.indexOf("#") === -1) {
      return "";
    }
    const tagArr = [];
    const dirtyTextArr = text.split("#");
    const resMap = dirtyTextArr.map((tagDirtyArr, i) => {
      if (i > 0) {
        const tagItem = tagDirtyArr.split(" ")[0];
        tagArr.push(tagItem);
        return tagDirtyArr;
      }
    });
    return tagArr;
  };

  const handleChangeMessage = (e) => {
    const value = e.target.value;
    e.target.style.height = 0;
    e.target.style.height = `${e.target.scrollHeight}px`;
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
      // change Promise.all to Promise.allSettled
      // { status: "fulfilled", value: 1 }
      // const attachments = await Promise.allSettled(
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

      const tagsArr = getTags(message);

      const postInstance = new PostModel({
        id: post.id ? post.id : "",
        source: user.source,
        type: post.type,
        text: message,
        target: {
          postHash: post.target?.postHash ? post.target?.postHash : "",
          sourceHash: post.target?.sourceHash ? post.target?.sourceHash : "",
        },
        mentions: mentions?.length ? mentions : "",
        attachments: attachments.length > 0 ? attachments : "",
        wif: user.wif,
      });

      const newPost = postInstance.newPost;

      setMessage("");
      setUploadedImg([]);
      dispatch(postActions.sendPost({ post: newPost, tags: tagsArr }));
      history.push(routes.feed);
    })();
  };

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
    // if (i > 0 && post.source.address) {
    if (i > 0 && post.source.address !== user.source.address) {
      return (
        <ReplyingUser
          key={i}
          avatar={post.source.avatar}
          name={post.source.publicName}
          checked={post.isMention}
          checkBoxName={post.hash}
          onChange={handleMention}
        />
      );
    } else if (post.source.address === user.source.address) {
      return (
        <div key={i} className={style.gap}>
          <div className={style.gapBlockLine}></div>
          {/* <span className={style.gapTitle}>Show this thread</span> */}
        </div>
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

  const handleMenuClose = (e) => {
    const dataHash = e.target.getAttribute("data-hash");

    if (dataHash) {
      return;
    } else {
      setOpenMenuHash(null);
    }
  };

  const handleShowMenu = (hash) => {
    setOpenMenuHash(hash);
  };

  const isShowMenu = (hash) => {
    return hash === openMenuHash ? true : false;
  };

  const handleEditPost = (hash, id) => {
    history.push(`${routes.newPost}?edit=${hash}`);
  };

  const renderParentPosts = () => {
    const parentPosts = getParentPostsForComment({
      postHashToComment: hash,
      subscribedSources,
    });
    return (
      <div onClick={(e) => handleMenuClose(e)}>
        <Post
          post={parentPosts}
          handleShowMenu={handleShowMenu}
          isShowMenu={isShowMenu}
          handleEditPost={handleEditPost}
        />
      </div>
    );
  };

  const handleBackArrowClick = () => {
    history.goBack();
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
            onClick={handleBackArrowClick}
            alt="arrow back icon"
          />
        )}
      </div>

      <div className={style.bodyBlock}>
        {replyingPage ? (
          <div className={style.replyingBlock}>
            <ReplyingUser
              avatar={comments[0]?.source?.avatar}
              name={comments[0]?.source?.publicName}
              checked={comments[0]?.isMention}
              checkBoxName={comments[0]?.hash}
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
            {post?.type === "reply" && renderParentPosts()}

            <div className={style.messageBlock}>
              <Avatar avatar={user.source.avatar} />
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
        )}
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
