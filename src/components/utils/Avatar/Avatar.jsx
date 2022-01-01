import { useEffect, useState } from "react";
import mime from "mime";
import { useHistory } from "react-router-dom";
import styles from "./avatar.module.scss";
import { routes as routs } from "../../../config/routes.config";
import { getFilePath } from "../../customHooks/getImgSources";
import { robotHash } from '../../../config/http.config.js';

const Avatar = ({ imgSmall = false, imgBig = false, isDirect = true, avatar, srcData, address, id, updateRouterContext }) => {
  const history = useHistory();

  const [src, setSrc] = useState('');
  // const [src, setSrc] = useState(userPlaceHolder);

  useEffect(() => {
    let isMounted = true;

    const urlRobotHashImg = robotHash({ hash: address })
    const image = new Image();
    image.src = urlRobotHashImg;
    image.onload = function () {
      if (isMounted) {
        setSrc(urlRobotHashImg);
      }
    };

    return () => {isMounted = false}
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
        if (updateRouterContext) {
          updateRouterContext();
        }
        history.push(`${routs.source}/${address}`, { elementId: id });
      } : () => { }
      }
    >
      <img
        src={src}
        alt=""
        className={`${styles.imgAvatar}  ${imgSmall && styles.imgAvatarSmall}  ${imgBig && styles.imgAvatarBig}`}
      ></img>
    </div>
  );
};

export default Avatar;
