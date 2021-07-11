import styles from "./postContent.module.scss";
import { Link, NavLink, useHistory } from "react-router-dom";
import routes from "../../../config/routes.config.js";
import { getFoldersName } from "../../customHooks/getImgSources";


const PostContent = ({ text, type, postHash, imgPrevSrc, hostAssets }) => {
  let history = useHistory();
  const postPathFrom = getFoldersName({ hash: postHash });
  const post_url = `${hostAssets}/${postPathFrom.first}/${postPathFrom.second}/${postPathFrom.fileName}.json`;
  const title = text ? text.slice(0, 140) : '';

  const img = imgPrevSrc ? imgPrevSrc : '';
  const handleDirect = () => {
    history.push(`${routes.post}/${postHash}?post_url=${post_url}&title=${title}$img=${img}`);
  };

  return (
    <>
      <div onClick={() => handleDirect()} className={styles.postContent}>
        {imgPrevSrc && (
          <img src={imgPrevSrc} alt="" className={styles.imgCommentPreview} />
        )}
        <span>{text}</span>
      </div>
    </>
  );
};

export default PostContent;
