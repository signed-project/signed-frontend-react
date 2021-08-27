import styles from "./postContent.module.scss";
import { useHistory, NavLink, Link } from "react-router-dom";
import routes from "../../../config/routes.config.js";
import { getFilePath } from "../../customHooks/getImgSources";
import Linkify from "linkifyjs/react";
import * as linkify from "linkifyjs";
import hashtag from "linkifyjs/plugins/hashtag";
hashtag(linkify);

const PostContent = ({ text, postHash, imgHostArr, hosts, address }) => {
  let history = useHistory();
  let options;
  const title = text ? text.slice(0, 140) : "";
  const img = imgHostArr ? imgHostArr[0]?.imagePreviewUrl : "";
  const handleDirect = () => {
    if (!postHash) {
      return;
    }
    const post_url = getFilePath({ hash: postHash, fileExtension: "json" });
    history.push(
      `${routes.post}/${postHash}?post_url=${post_url}&title=${title}&img=${img}`
    );
  };

  if (hosts) {
    options = {
      tagName: {
        hashtag: () => Link,
      },
      attributes: (href, type) => {
        if (type == "hashtag") {
          console.log("888");
          return {
            to: `/tag/${address}/${href.substring(1)}`,
          };
        }
        return "";
      },
    };
  }

  return (
    <>
      <div
        onClick={() => handleDirect()}
        className={`${styles.postContent} ${
          !postHash && styles.postContentPostPage
        }`}
      >
        {img && <img src={img} alt="" className={styles.imgCommentPreview} />}
        {/* <span>{text}</span> */}
        {hosts ? (
          <Linkify options={options}>{text}</Linkify>
        ) : (
          <span>{text}</span>
        )}
      </div>
    </>
  );
};

export default PostContent;
