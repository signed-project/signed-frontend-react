import styles from './postContent.module.scss';
import { Link, NavLink, useHistory } from 'react-router-dom';
import routes from '../../../config/routes.config.js';


const PostContent = ({ text, type, sourceAddress, imgPrevSrc }) => {
    let history = useHistory();
    const handleDirect = () => {
        // if (type === 'post' || type === 'repost' || type === 'like') {
        //     history.push(`${routes.post}/${sourceAddress}`);
        // }
        history.push(`${routes.post}/${sourceAddress}`);
    }

    console.log('imgPrevSrc', imgPrevSrc);

    return (
        <>
            <div onClick={() => handleDirect()} className={styles.postContent}>
                {imgPrevSrc && <img src={imgPrevSrc} alt="" className={styles.imgCommentPreview} />}
                <span>{text}</span>
            </div>
        </>
    )
}

export default PostContent;