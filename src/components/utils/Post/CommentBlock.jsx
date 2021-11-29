import { useEffect, useState } from "react";
import styles from "./post.module.scss";
import Avatar from "../Avatar/Avatar";
import InfoAuthor from "../InfoAuthor/InfoAuthor";
import PostContent from "../PostContent/PostContent";
import { getReadFormat } from "../../../libs/date.js";
import Reaction from "../Reaction/Reaction";
import icon from "../../../assets/svg/icon";
import useReaction from "../../customHooks/useReaction";
import useSourcePost from "../../customHooks/useSourcePost";
import getImgSources from "../../customHooks/getImgSources";
import { useSelector } from "react-redux";

// TODO: signature less element ?
const CommentBlock = ({
  post,
  img,
  mention,
  removeLastLine = false,
  showReactionBlock = false,
  id,
}) => {
  const {
    text,
    createdAt,
    hash,
    type,
    likesCount,
    repostsCount,
    source: { address },
  } = post;
  const [imgPreview, setImgPreview] = useState([]);
  const [source, setSource] = useState("");
  const { isAuth } = useSelector((state) => state.user);

  let sourceRes = useSourcePost(address);
  useEffect(() => {
    if (!sourceRes) {
      sourceRes = post.source;
    }
    if (sourceRes) {
      setSource(sourceRes);
    }
  }, [post]);
  const reaction = useReaction();

  useEffect(() => {
    if (post?.attachments?.length > 0) {
      const imgArrSources = getImgSources(post.attachments);
      setImgPreview(imgArrSources);
    }
  }, [post]);

  // console.log('post####CommentBlock', post);
  // console.log('source?.hosts', source?.hosts);
  // console.log('text', text);

  return (
    <>
      {source && (
        <div className={styles.commentBlock}>
          <div className={styles.avatarBlock}>
            <Avatar avatar={source?.avatar} address={address} id={id} />
            <div
              className={`${styles.verticalLine} ${
                removeLastLine && styles.verticalLineRemove
              }`}
            ></div>
          </div>
          <div className={styles.postBody}>
            <div className={styles.hover}>
              <InfoAuthor
                createdAt={getReadFormat(createdAt)}
                name={source.publicName}
                address={post.source.address}
                id={id}
              />
              <img
                src={icon.menu}
                alt="menu icon"
                className={styles.menuIcon}
              />
            </div>
            <div className={styles.commentBodyWrapper}>
              {/* {imgPreview.length > 0 && <img src={imgPreview[0]?.imagePreviewUrl} alt="" className={styles.imgCommentPreview} />} */}
              {source?.hosts && (
                <PostContent
                  hostAssets={source?.hosts[0]?.assets}
                  postHash={hash}
                  text={text}
                  type={type}
                  imgHostArr={imgPreview}
                  id={id}
                  // imgPrevSrc={imgPreview[0]?.imagePreviewUrl}
                />
              )}
            </div>
            { isAuth && (
                <Reaction
                  likesCount={likesCount}
                  repostsCount={repostsCount}
                  handleLike={() => reaction.handleLike({ rootPost: post, elementId: id })}
                  handleRepost={() => reaction.handleRepost({ rootPost: post, elementId: id })}
                  handleReply={() => reaction.handleReply({ rootPost: post, elementId: id })}
                />
              ) 
            }
          </div>
        </div>
      )}
    </>
  );
};

export default CommentBlock;
