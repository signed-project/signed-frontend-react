import styles from './notification.module.scss';
import { getFilePath } from '../../customHooks/getImgSources';
import { useHistory } from "react-router-dom";
import { routes } from "../../../config/routes.config.js";


const NotificationTargetPost = ({ text, img, postHash }) => {
    let history = useHistory();
    const title = text ? text.slice(0, 140) : '';
    const handleDirect = () => {
        if (!postHash) { return }
        const post_url = getFilePath({ hash: postHash, fileExtension: 'json' });
        history.push(`${routes.post}/${postHash}?post_url=${post_url}&title=${title}&img=${img}`);
    };

    const shortText = text && text.length < 80 ? text : `${text.slice(0, 80)}...`
    return (
        <div className={styles.targetPostWrapper} onClick={() => handleDirect()}>
            {img && (
                <img src={img} alt="" className={styles.imgTargetPost} />
            )}
            <span>
                {shortText}
            </span>
        </div>
    )
}


export default NotificationTargetPost;