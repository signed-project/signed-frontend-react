import { useState, useEffect } from "react";
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
import useSourcePost from "../../customHooks/useSourcePost";
import Preview from "../Preview/Preview";
import getImgArr from "../../customHooks/getImgSources";
import MenuPost from "../MenuPost/MenuPost";
import { useSelector } from "react-redux";

const Post = ({ post, handleShowMenu, isShowMenu, handleEditPost, id }) => {
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
  } = post.rootPost ? post.rootPost : post;

  let sourcePost = useSourcePost(address);
  let { rootPost: targetPost } = useTargetPost(postHash);
  const { isAuth } = useSelector((state) => state.user);

  let sourceTargetPost = useSourcePost(targetPost?.source?.address);
  const reaction = useReaction();

  const [imgPreview, setImgPreview] = useState([]);

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

  const renderComments = () => {
    const comments = [];

    for (let index = 0; index < post.replies?.length; index++) {
      if (index === 3) {
        comments.push(
          <div key={index} className={styles.gap}>
            <div className={styles.gapBlockLine}></div>
            <span className={styles.gapTitle}>Show this thread</span>
          </div>
        );

        break;
      }

      comments.push(
        <CommentBlock
          key={index}
          post={post.replies[index]}
          renderKey={index}
          removeLastLine={index + 1 === post.replies?.length}
          dotsLine={true}
          showReactionBlock={true}
          id={id}
        />
      );
    }

    return comments;
  };

  const reactionBlock = () => {
    return (
      <Reaction
        likesCount={targetPost?.likesCount}
        repostsCount={targetPost?.repostsCount}
        handleLike={() => reaction.handleLike({ rootPost: post.rootPost, elementId: id  })}
        handleRepost={() => reaction.handleRepost({ rootPost: post.rootPost, elementId: id  })}
        handleReply={() => reaction.handleReply({ rootPost: post.rootPost, elementId: id  })}
      />
    );
  };

  return (
    <>
      {sourcePost && (
        <div id={id} className={styles.post}>
          {type === "post" && sourcePost.hosts && (
            <>
              <div className={styles.typePost}>
                <div className={styles.avatarBlock}>
                  <Avatar avatar={sourcePost.avatar} address={address} id={id} />
                  <div
                    className={`${styles.verticalLine}  ${
                      post.replies?.length === 0 && styles.verticalLineRemove
                    }`}
                  ></div>
                </div>
                <div className={styles.postMain}>
                  <div className={styles.hover}>
                    <InfoAuthor
                      createdAt={getReadFormat(createdAt)}
                      name={sourcePost.publicName}
                      address={address}
                      id={id}
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
                        id={id}
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
                      id={id}
                      // imgHostArr={imgPreview}
                    />
                    <Preview uploadImgArr={imgPreview} postHash={hash} />
                  </div>
                  { isAuth && reactionBlock() }
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
                      className={`${styles.verticalLine}    ${
                        type === "like" && styles.verticalLineRemove
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
                    { isAuth && reactionBlock() }
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
                    className={`${styles.verticalLine}  ${
                      post.replies?.length === 0 && styles.verticalLineRemove
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
                  { isAuth && reactionBlock() }
                </div>
              </div>
            </>
          )}

          {post.replies && (
            <div className={styles.commentsWrapper}>{renderComments()}</div>
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
