import styles from "./postContent.module.scss";
import { Link, NavLink, useHistory } from "react-router-dom";
import routes from "../../../config/routes.config.js";
import { getFilePath } from "../../customHooks/getImgSources";


const PostContent = ({ text, type, postHash, imgPrevSrc, hostAssets, imgHostArr }) => {
  let history = useHistory();
  const post_url = getFilePath({ hash: postHash, fileExtension: 'json' });


  const title = text ? text.slice(0, 140) : '';
  console.log('imgHostArr', imgHostArr);
  const img = imgHostArr ? imgHostArr[0]?.imagePreviewUrl : '';
  const handleDirect = () => {
    history.push(`${routes.post}/${postHash}?post_url=${post_url}&title=${title}&img=${img}`);
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
