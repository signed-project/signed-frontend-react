
import styles from './reaction.module.scss';
import icon from '../../../assets/svg/icon';

const Reaction = () => {

    return (
        <>
            <div className={styles.reaction}>
                <div className={styles.reactionHistory}>
                    <div className={styles.like}>
                        <img src={icon.likeIcon} alt="" className={styles.reactionHistoryIcon} />
                        <span className={styles.reactionHistoryData}>
                            13
                        </span>
                    </div>
                    <div className={styles.like}>
                        <img src={icon.commentIcon} alt="" className={styles.reactionHistoryIcon} />
                        <span className={styles.reactionHistoryData}>
                            2
                        </span>
                    </div>
                </div>
                <div className={styles.actionReaction}>
                    <a href="" >Like</a>
                    <a href="">Reply</a>
                    <a href="">Repost </a>
                </div>
            </div>

        </>
    )
}

export default Reaction;