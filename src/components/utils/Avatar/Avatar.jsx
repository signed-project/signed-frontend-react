import { useHistory } from 'react-router-dom';
import styles from './avatar.module.scss';
import routs from '../../../config/routes.config';


const Avatar = ({ imgSmall = false }) => {
    const history = useHistory()
    return (
        <div className={styles.imgAvatarWrapper} onClick={() => { history.push(routs.source) }}>
            <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3/Harry-Potter-1-.jpg" alt="" className={`${styles.imgAvatar}  ${imgSmall && styles.imgAvatarSmall}`}></img>
        </div >
    )
}

export default Avatar;