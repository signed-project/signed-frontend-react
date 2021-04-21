import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import AuthorBlock from '../AuthorBlock/AuthorBlock';
import PostContent from '../PostContent/PostContent';
import Reaction from '../Reaction/Reaction';
import LikeMark from '../LikeMark/LikeMark';
import styles from './post.module.scss';
import icon from '../../../assets/svg/icon';
import { getReadFormat } from '../../../libs/date.js';
import RepostBlock from './RepostBlock';

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

const Post = ({ name, text, createdAt, likesCount, repostsCount, handleLike, type, postHash, handleRepost }) => {
    const targetPost = useTargetPost(postHash);
    return (
        <>
            { type === 'post' && <>
                <div className={styles.post}>
                    <div className={styles.wrapperContent}>
                        <AuthorBlock name={name} createdAt={getReadFormat(createdAt)} />
                        <img src={icon.menu} alt="menu icon" className={styles.menuIcon} />
                    </div>
                    <PostContent text={text} />
                    <Reaction
                        likesCount={likesCount}
                        repostsCount={repostsCount}
                        handleLike={handleLike}
                        handleRepost={handleRepost} />
                </div>
            </>}

            { type === 'like' && targetPost && <>
                <div className={styles.post}>
                    <LikeMark createdAt={getReadFormat(createdAt)} name={name} />
                    <div className={styles.wrapperContent}>
                        <AuthorBlock name={targetPost?.source?.name} createdAt={getReadFormat(targetPost.createdAt)} />
                    </div>
                    <PostContent text={targetPost?.text} />
                    <Reaction
                        likesCount={targetPost?.likesCount}
                        repostsCount={targetPost?.repostsCount}
                        handleLike={handleLike}
                        handleRepost={handleRepost} />
                </div>
            </>}
            { type === 'repost' && targetPost && <>
                <div className={styles.post}>
                    <div className={styles.wrapperContent}>
                        <AuthorBlock name={name} createdAt={getReadFormat(createdAt)} />
                        <img src={icon.menu} alt="menu icon" className={styles.menuIcon} />
                    </div>
                    <PostContent text={text} />
                    <RepostBlock postHash={postHash} />
                    <Reaction
                        likesCount={targetPost?.likesCount}
                        repostsCount={targetPost?.repostsCount}
                        handleRepost={handleRepost}
                        handleLike={handleLike} />
                </div>
            </>}


        </>
    )
}


export default Post;