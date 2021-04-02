import styles from './avatar.module.scss';


const Avatar = () => {

    return (
        <div className={styles.imgAvatarWrapper}>
            <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3/Harry-Potter-1-.jpg" alt="" className={styles.imgAvatar}></img>
        </div>
    )
}

export default Avatar;