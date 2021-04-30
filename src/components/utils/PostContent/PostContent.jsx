import styles from './postContent.module.scss';
import { Link, NavLink } from 'react-router-dom';
import routes from '../../../config/routes.config.js';
const PostContent = ({ text, sourceAddress }) => {
    return (
        <>
            <NavLink className={styles.navLink} to={`${routes.post}?post=${sourceAddress}`}>
                <div className={styles.postContent}>
                    <span>{text}</span>
                </div>
            </NavLink>
        </>
    )
}

export default PostContent;