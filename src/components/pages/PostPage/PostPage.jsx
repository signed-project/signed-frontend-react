import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import queryString from "query-string";
import icon from "../../../assets/svg/icon";
import styles from "./postPage.module.scss";
import { useLocation, useParams, useHistory } from "react-router-dom";
import RepostBlock from "../../utils/Post/RepostBlock";
import CommentBlock from "../../utils/Post/CommentBlock";
import { getReadFormat } from "../../../libs/date.js";
import Reaction from "../../utils/Reaction/Reaction";
import PostContent from "../../utils/PostContent/PostContent";
import useReaction from "../../customHooks/useReaction";
import getImgSources from "../../customHooks/getImgSources";
import Preview from "../../utils/Preview/Preview";
import Avatar from "../../utils/Avatar/Avatar";
import InfoAuthor from "../../utils/InfoAuthor/InfoAuthor";
import Slider from "../../utils/Slider/Slider";

import {
  getPostByHash,
  getSourceByAddress,
} from "./../../../api/customNpmPackage/signedLoader";
import { LayoutContext } from "../../layout/LayoutProvider";

// TODO: refactor this component to use module Post if it possible
const PostPage = () => {
  const layoutContext = useContext(LayoutContext);

  const subscribedSources = useSelector((state) => state.source.subscribed);
  const {
    isAuth,
    subscribed,
    source: userSource,
  } = useSelector((state) => state.user);
  const location = useLocation();
  const { slider } = queryString.parse(location.search);

  let { hash } = useParams();
  const history = useHistory();
  const reaction = useReaction();

  const [post, setPost] = useState("");
  const [comments, setComments] = useState([]);
  const [imgPreview, setImgPreview] = useState([]);
  const [showSlider, setShowSlider] = useState(false);
  const [sliderNum, setSliderNum] = useState("");
  const [currentPost, setCurrentPost] = useState("");
  const [source, setSource] = useState("");

  useEffect(() => {
    let post = {};

    if (!isAuth) {
      post = getPostByHash({ hash, subscribedSources: subscribedSources });

      setCurrentPost(post);
    } else {
      post = getPostByHash({
        hash,
        subscribedSources: [...subscribed, userSource],
      });

      setCurrentPost(post);
    }
  }, [hash, subscribedSources]);

  useEffect(() => {
    layoutContext.toggleTheme(false);
  }, [layoutContext]);

  useEffect(() => {
    if (currentPost) {
      setPost(currentPost.rootPost);
      if (currentPost.rootPost.source?.address) {
        const sourceData = getSourceByAddress(
          currentPost.rootPost.source.address
        );
        setSource(sourceData);
      }
    }
  }, [currentPost]);

  useEffect(() => {
    setComments(currentPost.replies);
  }, [currentPost]);

  useEffect(() => {
    if (post.attachments?.length) {
      const imgSourceArr = getImgSources(post.attachments);
      setImgPreview(imgSourceArr);
    }
  }, [post]);

  useEffect(() => {
    if (slider) {
      setSliderNum(slider);
      setShowSlider(true);
    }
  }, [slider]);

  const renderComments = comments
    ?.slice()
    .map((post, i) => (
      <CommentBlock
        post={post}
        type={post.type}
        key={i}
        img={post?.source?.avatar?.hash}
        name={post.source?.name}
        text={post.text}
        createdAt={post.createdAt}
        removeLastLine={comments.length === i + 1}
        hash={post.hash}
      />
    ));

  const handleFullSlider = (i) => {
    setShowSlider(true);
    setSliderNum(i);
  };

  const handleArrowBackClick = () => {
    history.goBack();
  };

  return showSlider ? (
    <Slider
      uploadImgArr={imgPreview}
      firstSlide={sliderNum}
      setIsFullImgPrev={setShowSlider}
    />
  ) : (
    <>
      <div className={styles.backBlock}>
        <img
          src={icon.arrowBack}
          onClick={handleArrowBackClick}
          alt="arrow back icon"
        />
      </div>
      {post && source && (
        <div className={styles.bodyBlock}>
          <div className={styles.typePost}>
            <div className={styles.avatarBlock}>
              <Avatar avatar={post.source.avatar} address={source.address} />
              <div
                className={`${styles.verticalLine} 
                             ${
                               comments.length === 0 &&
                               styles.verticalLineRemove
                             }`}
              ></div>
            </div>
            <div className={styles.postMain}>
              <div className={styles.hover}>
                <InfoAuthor
                  createdAt={getReadFormat(post.createdAt)}
                  name={source?.publicName}
                  address={source.address}
                />
                <img
                  src={icon.menu}
                  alt="menu icon"
                  className={styles.menuIcon}
                />
              </div>
              <div className={styles.bodyWrapper}>
                {/* TODO: find out name sourceAddress,are is better  hash ?  */}
                <PostContent
                  hosts={source.hosts}
                  text={post.text}
                  type={post.type}
                  address={currentPost.rootPost.source.address}
                />
                <Preview
                  uploadImgArr={imgPreview}
                  handleFullSlider={handleFullSlider}
                />
                {post.rootPost?.type === "repost" && (
                  <div className={styles.repostBlockWrapper}>
                    <RepostBlock postHash={post.target.postHash} />
                  </div>
                )}
              </div>
              { isAuth && (
                <Reaction
                  likesCount={post.likesCount}
                  repostsCount={post.repostsCount}
                  handleLike={() => reaction.handleLike({ 
                    rootPost: post, 
                    elementId: location.state.elementId 
                  })}
                  handleRepost={() => reaction.handleRepost({ 
                    rootPost: post, 
                    elementId: location.state.elementId 
                  })}
                  handleReply={() => reaction.handleReply({ 
                    rootPost: post, 
                    elementId: location.state.elementId 
                  })}
                />
              ) 
            }
            </div>
          </div>

          {comments.length > 0 && (
            <div className={styles.commentsWrapper}>{renderComments}</div>
          )}
        </div>
      )}
    </>
  );
};

export default PostPage;
