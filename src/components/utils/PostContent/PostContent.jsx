import styles from './postContent.module.scss';
import { Link, NavLink, useHistory } from 'react-router-dom';
import routes from '../../../config/routes.config.js';


const PostContent = ({ text, type, sourceAddress }) => {

    let history = useHistory();

    const handleDirect = () => {
        console.log('RRRRRRRRRRRRRRRRRRRRRRRR', type);
        if (type === 'post' || type === 'repost' || type === 'like') {
            console.log('RRRRRRRRRRRRRRRRRRRRRRRR', type);
            history.push(`post/${sourceAddress}`)
        }
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