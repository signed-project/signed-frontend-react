import styles from './avatar.module.scss';

const Avatar = ({ imgSmall = false }) => {

    return (
        <div className={styles.imgAvatarWrapper}>
            <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3/Harry-Potter-1-.jpg" alt="" className={`${styles.imgAvatar}  ${imgSmall && styles.imgAvatarSmall}`}></img>
        </div>
    )
}

export default Avatar;