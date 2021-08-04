import styles from './notification.module.scss';

const NotificationTargetPost = ({ text }) => {
    const shortText = text && text.length < 80 ? text : `${text.slice(0, 80)}...`

    return (
        <div className={styles.targetPostWrapper}>
            <span>
                {shortText}
            </span>
        </div>
    )
}


export default NotificationTargetPost;