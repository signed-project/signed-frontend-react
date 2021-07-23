import { useHistory } from "react-router-dom";
import styles from './likeMark.module.scss';
import icon from '../../../assets/svg/icon';
import routs from "../../../config/routes.config";


const LikeMark = ({ createdAt, name, address }) => {
    const history = useHistory();
    return (
        <div className={styles.likeMarkWrapper}>
            <div className={styles.likeMark}>
                <div className={styles.likeRow} onClick={() => {
                    history.push(`${routs.source}/${address}`);
                }}>
                    <img src={icon.likeMark} alt="like mark icon" className={styles.menuIcon} />
                    <span className={styles.name}>{name}</span>
                    <span className={styles.descriptionLike}>Like this post</span>
                </div>
                <div>
                    <span className={styles.date}>{createdAt}</span>
                </div>
            </div>
            <img src={icon.menu} alt="menu icon" className={styles.menuIcon} />
        </div>
    )
}

export default LikeMark;