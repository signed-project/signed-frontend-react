
import { useEffect, useState } from 'react';
import styles from './post.module.scss';
import { useTargetPost } from './Post';
import AuthorBlock from '../AuthorBlock/AuthorBlock';
import Avatar from '../Avatar/Avatar';
import InfoAuthor from '../InfoAuthor/InfoAuthor';
import PostContent from '../PostContent/PostContent';
import { getReadFormat } from '../../../libs/date.js';
import Reaction from '../Reaction/Reaction';
import icon from '../../../assets/svg/icon';

const CommentBlock = ({ img, name, type, text, createdAt, mention,
    removeLastLine = false, showReactionBlock = false, likesCount, repostsCount,
    handleLike, handleRepost, handleReply, hash }) => {

    console.log('removeLastLine', removeLastLine);
    return (
        <div className={styles.commentBlock}>
            <div className={styles.avatarBlock}>
                <Avatar />
                <div className={`${styles.verticalLine} ${removeLastLine && styles.verticalLineRemove}`}></div>
            </div>
            <div className={styles.postBody}>
                <div className={styles.hover}>
                    <InfoAuthor createdAt={getReadFormat(createdAt)} name={name} />
                    <img src={icon.menu} alt="menu icon" className={styles.menuIcon} />
                </div>
                <div className={styles.bodyWrapper}>
                    <PostContent sourceAddress={hash} text={text} type={type} />
                </div>
                {/* TODO: replying to */}
                {showReactionBlock &&
                    <Reaction
                        likesCount={likesCount}
                        repostsCount={repostsCount}
                        handleLike={handleLike}
                        handleRepost={handleRepost}
                        handleReply={handleReply} />
                }
            </div>

        </div>
    )
};


export default CommentBlock;
