import { useEffect, useState } from "react";
import mime from "mime";
import { useHistory } from "react-router-dom";
import styles from "./avatar.module.scss";
import routs from "../../../config/routes.config";
import { getFilePath } from "../../customHooks/getImgSources";
import userPlaceHolder from "../../../assets/svg/icon/userPlaceHolder.jpg";

const Avatar = ({ imgSmall = false, avatar }) => {
  const history = useHistory();

  const [src, setSrc] = useState(userPlaceHolder);

  useEffect(() => {
    console.log("avatar---------------", avatar);

    if (avatar && avatar.hash && avatar.contentType) {
      const extension = mime.getExtension(avatar.contentType);
      const srcImg = getFilePath({
        hash: avatar?.hash,
        fileExtension: extension,
      });
      console.log("srcImg", srcImg);
      const image = new Image();
      image.src = srcImg;
      image.onload = function () {
        setSrc(srcImg);
      };
    }
  }, [avatar]);

  return (
    <div
      className={styles.imgAvatarWrapper}
      onClick={() => {
        history.push(routs.source);
      }}
    >
      <img
        src={src}
        // src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3/Hary-Potter-1-.jpg"
        alt=""
        className={`${styles.imgAvatar}  ${imgSmall && styles.imgAvatarSmall}`}
      ></img>
    </div>
  );
};

export default Avatar;
