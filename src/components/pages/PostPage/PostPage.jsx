import React, { useEffect, useState } from "react";
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
import getCommentTrees from "../../customHooks/getCommentTrees";
import getImgSources from "../../customHooks/getImgSources";
import Preview from "../../utils/Preview/Preview";
import Avatar from "../../utils/Avatar/Avatar";
import InfoAuthor from "../../utils/InfoAuthor/InfoAuthor";
import Slider from "../../utils/Slider/Slider";
import routes from "../../../config/routes.config";
import { hostApi, userApi } from "./../../../config/http.config.js";

import { getPostByHash } from "./../../../api/customNpmPackage/signedLoader";
import axios from "axios";

const apiHost = hostApi.API_HOST;

// TODO: refactor this component to use module Post if it possible
const PostPage = ({ toggleTheme }) => {
  // const postMapState = useSelector((state) => state.post.hashed);
  // const hashedTargetPostStore = useSelector((state) => state.post.hashedTargetPost);
  // FIX: storage sources in Internal Store and provide from it method for get them
  const sourceStateLatest = useSelector(state => state.source.latest);
  const subscribedSources = useSelector((state) => state.source.subscribed);
  const { isAuth, subscribed, source: userSource } = useSelector(state => state.user);
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

      console.log('POST-POST');
      console.dir(post);
      setCurrentPost(post);
    } else {
      post = getPostByHash({ hash, subscribedSources: [...subscribed, userSource] });

      setCurrentPost(post);
    }
  }, [hash])

  useEffect(() => {
    toggleTheme(false);
  }, [toggleTheme]);

  useEffect(() => {
    if (currentPost) {
      console.log("currentPost-currentPost-currentPost");
      console.dir(currentPost);
      setPost(currentPost.rootPost);
      if (currentPost.rootPost.source?.address) {
        const sourceData = sourceStateLatest[currentPost.rootPost.source.address];
        setSource(sourceData);
      }
    }
  }, [currentPost, sourceStateLatest]);

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

  console.log('post[post]', post);
  console.log('post[source]', source);

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
          onClick={() => history.push(routes.feed)}
          alt="arrow back icon"
        />
      </div>
      {post && source && (
        <div className={styles.bodyBlock}>
          <div className={styles.typePost}>
            <div className={styles.avatarBlock}>
              <Avatar avatar={post.source.avatar} address={source.address} />
              {/*  ${styles.verticalLineRemove} */}
              <div
                className={`${styles.verticalLine} 
                             ${comments.length === 0 &&
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
              <Reaction
                likesCount={post.likesCount}
                repostsCount={post.repostsCount}
                handleLike={() => reaction.handleLike(post)}
                handleRepost={() => reaction.handleRepost(post)}
                handleReply={() => reaction.handleReply(post)}
              />
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
