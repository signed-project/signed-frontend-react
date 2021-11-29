
import styles from './infoAuthor.module.scss';
import icon from '../../../assets/svg/icon';
import { routes } from '../../../config/routes.config';
import { useHistory } from "react-router-dom";
import { getFilePath } from "../../customHooks/getImgSources";

const InfoAuthor = ({ name, createdAt, address, isShowDate = true, typePost, targetPostText, postHash, title, img, id }) => {
    const history = useHistory();


    const handleDirect = () => {
        if (!postHash) { return }
        const post_url = getFilePath({ hash: postHash, fileExtension: 'json' });
        history.push(`${routes.post}/${postHash}?post_url=${post_url}&title=${title}&img=${img}`,{ elementId: id });
    };

    const notificationInfo = ({ typePost, targetPostText }) => {
        if (!typePost) return;
        let text;
        if (targetPostText) {
            text = targetPostText.length > 30 ? `${targetPostText.slice(0, 30)}...` : targetPostText
        } else {
            text = '<blank>';
        }

        if (typePost === 'reply') {
            return (
                <>
                    <span className={styles.notificationDescription}> replied to </span>
                    <span className={styles.notificationTypePost} onClick={() => handleDirect()}> {text}</span>
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
                    <div className={styles.nameBlock} >
                        <img 
                            src={icon.tickOne} 
                            alt="tick icon" 
                            className={styles.tickOne} 
                            onClick={() => {
                                history.push(`${routes.source}/${address}`, { elementId: id });
                            }} 
                        />
                        <span 
                            className={styles.name} 
                            onClick={() => {
                                history.push(`${routes.source}/${address}`, { elementId: id });
                            }}
                        >{name}</span>
                        {typePost && notificationInfo({ typePost, targetPostText })}
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