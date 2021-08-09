import styles from "./postContent.module.scss";
import { useHistory } from "react-router-dom";
import routes from "../../../config/routes.config.js";
import { getFilePath } from "../../customHooks/getImgSources";


const PostContent = ({ text, postHash, imgHostArr }) => {
  let history = useHistory();

  const title = text ? text.slice(0, 140) : '';
  const img = imgHostArr ? imgHostArr[0]?.imagePreviewUrl : '';
  const handleDirect = () => {
    if (!postHash) { return }
    const post_url = getFilePath({ hash: postHash, fileExtension: 'json' });
    history.push(`${routes.post}/${postHash}?post_url=${post_url}&title=${title}&img=${img}`);
  };

  return (
    <>
      <div onClick={() => handleDirect()} className={styles.postContent}>
        {img && (
          <img src={img} alt="" className={styles.imgCommentPreview} />
        )}
        <span>{text}</span>
      </div>
    </>
  );
};

export default PostContent;
