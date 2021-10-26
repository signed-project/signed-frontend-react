import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import InfoAuthor from "../InfoAuthor/InfoAuthor";
import Avatar from "../Avatar/Avatar";
import PostContent from "../PostContent/PostContent";
import Reaction from "../Reaction/Reaction";
import LikeMark from "../LikeMark/LikeMark";
import RepostBlock from "./RepostBlock";
import CommentBlock from "./CommentBlock";
import icon from "../../../assets/svg/icon";
import { getReadFormat } from "../../../libs/date.js";
import styles from "./post.module.scss";
import useReaction from "../../customHooks/useReaction";
import useTargetPost from "../../customHooks/useTargetPost";
import getCommentTrees from "../../customHooks/getCommentTrees";
import useSourcePost from "../../customHooks/useSourcePost";
import Preview from "../Preview/Preview";
import getImgArr from "../../customHooks/getImgSources";
import MenuPost from "../MenuPost/MenuPost";

const Post = ({ post, handleShowMenu, isShowMenu, handleEditPost }) => {
  const {
    type,
    text,
    likesCount,
    repostsCount,
    attachments,
    hash,
    createdAt,
    source: { address, publicName, avatar },
    target: { postHash },
  } = post;

  let sourcePost = useSourcePost(address);
  let targetPost = useTargetPost(postHash);

  let sourceTargetPost = useSourcePost(targetPost?.source?.address);
  const reaction = useReaction();

  const [targetPostHashMap, setTargetPostHashMap] = useState({});
  const [comments, setComments] = useState([]);
  const [imgPreview, setImgPreview] = useState([]);
  const hashedTargetPostStore = useSelector((state) => state.post.hashedTargetPost);

  useEffect(() => {
    setTargetPostHashMap(hashedTargetPostStore);
  }, [hashedTargetPostStore]);

  useEffect(() => {
    const commentsTrees = getCommentTrees({
      targetHashMap: targetPostHashMap,
      currentPostHash: hash,
    });
    setComments(commentsTrees);
  }, [targetPostHashMap, hash]);

  useEffect(() => {
    const imgSources = getImgArr(attachments);
    setImgPreview(imgSources);
  }, [attachments]);

  useEffect(() => {
    if (targetPost?.attachments?.length > 0) {
      const imgSources = getImgArr(targetPost.attachments);
      setImgPreview(imgSources);
    }
  }, [targetPost]);

  if (!postHash) {
    targetPost = {
      likesCount: likesCount,
      repostsCount: repostsCount,
    };
  }

  const renderComments = comments.map((c, i) => {
    if (i === 3) {
      return (
        <div key={i} className={styles.gap}>
          <div className={styles.gapBlockLine}></div>
          <span className={styles.gapTitle}>Show this thread</span>
        </div>
      );
    }

    // if (subscribed.includes(c.source.address) && i !== 3) {
    return (
      <CommentBlock
        key={i}
        post={c}
        renderKey={i}
        removeLastLine={i + 1 === comments.length}
        dotsLine={true}
        showReactionBlock={true}
      />
    );
  });

  const reactionBlock = () => {
    return (
      <Reaction
        likesCount={targetPost?.likesCount}
        repostsCount={targetPost?.repostsCount}
        handleLike={() => reaction.handleLike(post)}
        handleRepost={() => reaction.handleRepost(post)}
        handleReply={() => reaction.handleReply(post)}
      />
    );
  };

  const isHideLine = comments.length < 1;

  return (
    <>
      {sourcePost && (
        <div className={styles.post}>
          {type === "post" && sourcePost.hosts && (
            <>
              <div className={styles.typePost}>
                <div className={styles.avatarBlock}>
                  <Avatar avatar={sourcePost.avatar} address={address} />
                  <div
                    className={`${styles.verticalLine}  ${comments.length === 0 && styles.verticalLineRemove
                      }`}
                  ></div>
                </div>
                <div className={styles.postMain}>
                  <div className={styles.hover}>
                    <InfoAuthor
                      createdAt={getReadFormat(createdAt)}
                      name={sourcePost.publicName}
                      address={address}
                    />
                    <div
                      className={styles.menuIconWrapper}
                      onClick={() => handleShowMenu(hash)}
                      data-hash={hash}
                    >
                      <img
                        src={icon.menu}
                        alt="menu icon"
                        className={styles.menuIcon}
                        onClick={() => handleShowMenu(hash)}
                        data-hash={hash}
                      />
                    </div>

                    {isShowMenu(hash) && (
                      <MenuPost
                        dataHash={hash}
                        handleEditPost={handleEditPost}
                      />
                    )}
                  </div>
                  <div className={styles.bodyWrapper}>
                    {/*  text, postHash, imgHostArr, hosts */}
                    <PostContent
                      hosts={sourcePost.hosts}
                      postHash={hash}
                      text={text}
                      address={address}
                    // imgHostArr={imgPreview}
                    />
                    <Preview uploadImgArr={imgPreview} postHash={hash} />
                  </div>
                  {reactionBlock()}
                </div>
              </div>
            </>
          )}

          {type === "like" && targetPost && sourceTargetPost && (
            <>
              <div className={styles.typeLike}>
                <LikeMark
                  createdAt={getReadFormat(createdAt)}
                  name={sourcePost.publicName}
                  address={address}
                />
                <div className={styles.avatarWrapper}>
                  <div className={styles.avatarBlock}>
                    <Avatar
                      avatar={sourceTargetPost.avatar}
                      address={address}
                    />
                    <div
                      className={`${styles.verticalLine}    ${type === "like" && styles.verticalLineRemove
                        }`}
                    ></div>
                  </div>
                  <div className={styles.postBody}>
                    <div className={styles.hover}>
                      <InfoAuthor
                        address={targetPost.source.address}
                        createdAt={getReadFormat(targetPost.createdAt)}
                        name={sourceTargetPost.publicName}
                      />
                    </div>
                    <div className={styles.bodyWrapper}>
                      <PostContent
                        hostAssets={targetPost.source.hosts[0].assets}
                        postHash={targetPost.hash}
                        text={targetPost?.text}
                        type={type}
                        imgPrevSrc={imgPreview[0]?.imagePreviewUrl}
                      />
                      <Preview
                        uploadImgArr={imgPreview}
                        postHash={targetPost.hash}
                      />
                    </div>
                    {reactionBlock()}
                  </div>
                </div>
              </div>
            </>
          )}
          {type === "repost" && targetPost && (
            <>
              <div className={styles.typePost}>
                <div className={styles.avatarBlock}>
                  <Avatar avatar={sourcePost.avatar} address={address} />
                  <div
                    className={`${styles.verticalLine}  ${comments.length === 0 && styles.verticalLineRemove
                      }`}
                  ></div>
                </div>
                <div className={styles.postMain}>
                  <div className={styles.hover}>
                    <InfoAuthor
                      createdAt={getReadFormat(createdAt)}
                      name={sourcePost.publicName}
                      address={address}
                    />
                    <img
                      src={icon.menu}
                      alt="menu icon"
                      className={styles.menuIcon}
                    />
                  </div>
                  <div className={styles.bodyWrapper}>
                    <PostContent
                      hostAssets={sourcePost?.hosts[0]?.assets}
                      postHash={hash}
                      text={text}
                      type={type}
                      imgPrevSrc={imgPreview[0]?.imagePreviewUrl}
                    />
                  </div>
                  <RepostBlock postHash={targetPost.hash} />
                  {reactionBlock()}
                </div>
              </div>
            </>
          )}
          {comments && (
            <div className={styles.commentsWrapper}>{renderComments}</div>
          )}
        </div>
      )}
    </>
  );
};

Post.propTypes = {
  name: PropTypes.string,
  text: PropTypes.string,
  createdAt: PropTypes.number,
  likesCount: PropTypes.number,
  handleLike: PropTypes.func,
  handleRepost: PropTypes.func,
  type: PropTypes.string,
  postHash: PropTypes.string,
};

export default Post;
