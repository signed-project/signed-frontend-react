
import styles from './reaction.module.scss';
import icon from '../../../assets/svg/icon';
import Button from '../Button/Button';

const Reaction = ({ likesCount, reportsCount, handleLike }) => {

    return (
        <>
            <div className={styles.reaction}>
                <div className={styles.reactionHistory}>
                    <div className={styles.like}>
                        <img src={icon.likeIcon} alt="" className={styles.reactionHistoryIcon} />
                        <span className={styles.reactionHistoryData}>
                            {likesCount}
                        </span>
                    </div>
                    <div className={styles.like}>
                        <img src={icon.commentIcon} alt="" className={styles.reactionHistoryIcon} />
                        <span className={styles.reactionHistoryData}>
                            {reportsCount}
                        </span>
                    </div>
                </div>
                <div className={styles.actionReaction}>
                    <Button className='clean_white' onClick={() => handleLike()}>Like</Button>
                    <Button className='clean_white'>Reply</Button>
                    <Button className='clean_white'>Repost</Button>
                    {/* <a href="" >Like</a>
                    <a href="">Reply</a>
                    <a href="">Repost </a> */}
                </div>
            </div>

        </>
    )
}

export default Reaction;