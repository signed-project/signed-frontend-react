import styles from './likeMark.module.scss';
import icon from '../../../assets/svg/icon';


const LikeMark = ({ date, name }) => {
    return (
        <div className={styles.likeMarkWrapper}>
            <div className={styles.likeMark}>
                <div className={styles.likeRow}>
                    <img src={icon.likeMark} alt="like mark icon" className={styles.menuIcon} />
                    <span className={styles.name}>{name}</span>
                    <span className={styles.descriptionLike}>Like this post</span>
                </div>
                <div>
                    <span className={styles.date}>{date}</span>
                </div>
            </div>
            <img src={icon.menu} alt="menu icon" className={styles.menuIcon} />
        </div>
    )
}

export default LikeMark;