
import { useEffect, useState } from 'react';
import styles from './post.module.scss';
import { useTargetPost } from './Post';
import AuthorBlock from '../AuthorBlock/AuthorBlock';
import Avatar from '../Avatar/Avatar';
import InfoAuthor from '../InfoAuthor/InfoAuthor';
import PostContent from '../PostContent/PostContent';
import { getReadFormat } from '../../../libs/date.js';

const CommentBlock = ({ img, name, text, createdAt, mention }) => {

    return (
        <div className={styles.commentBlock}>
            <div className={styles.avatarBlock}>
                <Avatar />
                <div className={styles.verticalLine}></div>
            </div>
            <div className={styles.postBody}>
                <InfoAuthor createdAt={createdAt} name={name} />
                <div className={styles.bodyWrapper}>
                    <PostContent text={text} />
                </div>
                {/* TODO: replying to */}
            </div>
        </div>
    )
};


export default CommentBlock;
