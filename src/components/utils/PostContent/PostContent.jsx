import styles from "./postContent.module.scss";
import { Link, NavLink, useHistory } from "react-router-dom";
import routes from "../../../config/routes.config.js";

const PostContent = ({ text, type, sourceAddress, imgPrevSrc }) => {
  let history = useHistory();
  const handleDirect = () => {
    history.push(`${routes.post}/${sourceAddress}`);
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
