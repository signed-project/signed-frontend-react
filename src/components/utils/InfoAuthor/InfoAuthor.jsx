
import styles from './infoAuthor.module.scss';
import icon from '../../../assets/svg/icon';
import routs from '../../../config/routes.config';
import { useHistory } from "react-router-dom";


const InfoAuthor = ({ name, createdAt, address, isShowDate = true, typePost, typeTargetPost }) => {
    const history = useHistory();

    const notificationInfo = ({ typePost, typeTargetPost }) => {
        if (!typePost || !typeTargetPost) return;
        let notification;
        let targetTypePostText;
        switch (typeTargetPost) {
            case 'post':
                targetTypePostText = 'post';
                break;
            case 'reply':
                targetTypePostText = 'comment';
                break;
            default:
                break;
        }
        if (typePost === 'reply') {
            return (
                <>
                    <span className={styles.notificationDescription}> replied to </span>
                    <span className={styles.notificationTypePost}> {targetTypePostText}</span>
                </>
            )
        }
        else if (typePost === 'like') {
            return (
                <>
                    <img src={icon.likeMark} alt="like mark icon" className={styles.menuIcon} />
                    <span>like your post</span>
                </>
            )
        }
    }

    return (
        <>
            <div className={styles.info}>
                <div className={styles.textWrapper} >
                    <div className={styles.nameBlock} onClick={() => {
                        history.push(`${routs.source}/${address}`);
                    }} >
                        <img src={icon.tickOne} alt="tick icon" className={styles.tickOne} />
                        <span className={styles.name}>{name}</span>
                        {typePost && typeTargetPost && notificationInfo({ typePost, typeTargetPost })}
                    </div>
                    {isShowDate && <div className={styles.date}>
                        <span>{createdAt}</span>
                    </div>}
                </div>
            </div>

        </>
    )
}

export default InfoAuthor