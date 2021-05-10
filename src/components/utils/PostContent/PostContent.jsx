import styles from './postContent.module.scss';
import { Link, NavLink, useHistory } from 'react-router-dom';
import routes from '../../../config/routes.config.js';


const PostContent = ({ text, type, sourceAddress }) => {
    let history = useHistory();
    const handleDirect = () => {
        // if (type === 'post' || type === 'repost' || type === 'like') {
        //     history.push(`${routes.post}/${sourceAddress}`);
        // }
        history.push(`${routes.post}/${sourceAddress}`);
    }

    return (
        <>
            {/* <NavLink className={styles.navLink} to={`post/${sourceAddress}`}> */}
            <div onClick={() => handleDirect()} className={styles.postContent}>
                <span>{text}</span>
            </div>
            {/* </NavLink> */}
        </>
    )
}

export default PostContent;