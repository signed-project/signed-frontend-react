import { useEffect, useState } from "react";
import mime from "mime";
import { useHistory } from "react-router-dom";
import styles from "./avatar.module.scss";
import routs from "../../../config/routes.config";
import { getFilePath } from "../../customHooks/getImgSources";
import userPlaceHolder from "../../../assets/svg/icon/userPlaceHolder.jpg";
import { robotHash } from '../../../config/http.config.js';

const Avatar = ({ imgSmall = false, imgBig = false, isDirect = true, avatar, srcData, address }) => {
  const history = useHistory();

  const [src, setSrc] = useState('');
  // const [src, setSrc] = useState(userPlaceHolder);

  useEffect(() => {

    const urlRobotHashImg = robotHash({ hash: address })
    const image = new Image();
    image.src = urlRobotHashImg;
    image.onload = function () {
      setSrc(urlRobotHashImg);
    };
  }, [address])

  useEffect(() => {
    let srcImg
    if (avatar && avatar.hash && avatar.contentType) {
      const extension = mime.getExtension(avatar.contentType);
      srcImg = getFilePath({
        hash: avatar?.hash,
        fileExtension: extension,
      });
    }
    if (srcData) {
      srcImg = srcData
    }
    const image = new Image();
    image.src = srcImg;
    image.onload = function () {
      setSrc(srcImg);
    };
  }, [avatar, srcData]);

  return (
    <div
      className={`${!imgBig && styles.imgAvatarWrapper}`}
      onClick={isDirect ? () => {
        history.push(`${routs.source}/${address}`);
      } : () => { }
      }
    >
      <img
        src={src}
        // src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3/Hary-Potter-1-.jpg"
        alt=""
        className={`${styles.imgAvatar}  ${imgSmall && styles.imgAvatarSmall}  ${imgBig && styles.imgAvatarBig}`}
      ></img>
    </div>
  );
};

export default Avatar;
