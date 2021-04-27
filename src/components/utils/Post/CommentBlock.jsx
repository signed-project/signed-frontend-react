
import { useEffect, useState } from 'react';
import styles from './post.module.scss';
import { useTargetPost } from './Post';
import AuthorBlock from '../AuthorBlock/AuthorBlock';
import Avatar from '../Avatar/Avatar';
import InfoAuthor from '../InfoAuthor/InfoAuthor';
import PostContent from '../PostContent/PostContent';
import { getReadFormat } from '../../../libs/date.js';
import Reaction from '../Reaction/Reaction';

const CommentBlock = ({ key, img, name, text, createdAt, mention,
    removeLastLine = false, showReactionBlock = false, likesCount, repostsCount,
    handleLike, handleRepost, handleReply }) => {

    return (
        <div key={+key + 1} className={styles.commentBlock}>
            <div className={styles.avatarBlock}>
                <Avatar />
                <div className={`${styles.verticalLine} ${removeLastLine && styles.verticalLineRemove}`}></div>
                <div className={`${styles.dotsVerticalLine}`}></div>
            </div>
            <div className={styles.postBody}>
                <InfoAuthor createdAt={getReadFormat(createdAt)} name={name} />
                <div className={styles.bodyWrapper}>
                    <PostContent text={text} />
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
