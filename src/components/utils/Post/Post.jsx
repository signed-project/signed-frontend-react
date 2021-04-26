import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types'

import AuthorBlock from '../AuthorBlock/AuthorBlock';
import PostContent from '../PostContent/PostContent';
import Reaction from '../Reaction/Reaction';
import LikeMark from '../LikeMark/LikeMark';
import RepostBlock from './RepostBlock';
import icon from '../../../assets/svg/icon';
import { getReadFormat } from '../../../libs/date.js';
import styles from './post.module.scss';


export const useTargetPost = (postHash) => {
    const hashedPost = useSelector(state => state.post.hashed);
    const [targetPost, setTargetPost] = useState('')
    useEffect(() => {
        if (postHash) {
            setTargetPost(hashedPost[postHash])
        }
    }, [hashedPost, postHash]);
    return targetPost
};

const Post = ({ name, text, createdAt, likesCount, repostsCount, handleLike, type, postHash, handleRepost, handleReply }) => {
    let targetPost = useTargetPost(postHash);

    if (!postHash) {
        targetPost = {
            likesCount: likesCount,
            repostsCount: repostsCount
        }
    }

    return (
        <>
            <div className={styles.post}>

                {type === 'post' && <>
                    <div className={styles.wrapperContent}>
                        <AuthorBlock name={name} createdAt={getReadFormat(createdAt)} />
                        <img src={icon.menu} alt="menu icon" className={styles.menuIcon} />
                    </div>
                    <PostContent text={text} />
                </>}
                {type === 'like' && targetPost && <> <LikeMark createdAt={getReadFormat(createdAt)} name={name} />
                    <div className={styles.wrapperContent}>
                        <AuthorBlock name={targetPost?.source?.name} createdAt={getReadFormat(targetPost.createdAt)} />
                    </div>
                    <PostContent text={targetPost?.text} />
                </>}
                {type === 'repost' && targetPost && <> <div className={styles.wrapperContent}>
                    <AuthorBlock name={name} createdAt={getReadFormat(createdAt)} />
                    <img src={icon.menu} alt="menu icon" className={styles.menuIcon} />
                </div>
                    <PostContent text={text} />
                    <RepostBlock postHash={postHash} /> </>}

                <Reaction
                    likesCount={targetPost?.likesCount}
                    repostsCount={targetPost?.repostsCount}
                    handleLike={handleLike}
                    handleRepost={handleRepost}
                    handleReply={handleReply} />
            </div>
        </>
    )
}

Post.propTypes = {
    name: PropTypes.string,
    text: PropTypes.string,
    createdAt: PropTypes.number,
    likesCount: PropTypes.number,
    handleLike: PropTypes.func,
    handleRepost: PropTypes.func,
    type: PropTypes.string,
    postHash: PropTypes.string,
}

export default Post;