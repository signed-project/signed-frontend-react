import styles from "./reaction.module.scss";
import icon from "../../../assets/svg/icon";
import Button from "../Button/Button";

const Reaction = ({
  likesCount,
  repostsCount,
  handleLike,
  handleRepost,
  handleReply,
}) => {
  const isNotNull = (num) => {
    return Number(num) > 0 ? num : "";
  };

  return (
    <>
      <div className={styles.reaction}>
        <div className={styles.reactionHistory}>
          <div className={styles.reactionHistoryItem}>
            <img
              src={icon.like}
              alt=""
              className={styles.reactionHistoryIcon}
            />
            <span className={styles.reactionHistoryData}>
              {isNotNull(likesCount)}
            </span>
          </div>
          <div className={styles.reactionHistoryItem}>
            <img
              src={icon.comment}
              alt=""
              className={styles.reactionHistoryIcon}
            />
            <span className={styles.reactionHistoryData}>
              {isNotNull(repostsCount)}
            </span>
          </div>
        </div>
        <div className={styles.actionReaction}>
          <div>
            <Button className="clean_white" onClick={() => handleLike()}>
              Like
            </Button>
          </div>
          <div>
            {" "}
            <Button className="clean_white" onClick={() => handleReply()}>
              Reply
            </Button>
          </div>
          <div>
            <Button className="clean_white" onClick={() => handleRepost()}>
              Repost
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Reaction;
