import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types'

import AuthorBlock from '../AuthorBlock/AuthorBlock';
import PostContent from '../PostContent/PostContent';
import Reaction from '../Reaction/Reaction';
import LikeMark from '../LikeMark/LikeMark';
import RepostBlock from './RepostBlock';
import CommentBlock from './CommentBlock';
import icon from '../../../assets/svg/icon';
import { getReadFormat } from '../../../libs/date.js';
import styles from './post.module.scss';
import Button from '../Button/Button';


export const useTargetPost = (postHash) => {
    const hashedPostState = useSelector(state => state.post.hashed);
    const [targetPost, setTargetPost] = useState('');
    useEffect(() => {
        if (postHash) {
            setTargetPost(hashedPostState[postHash])
        }
    }, [hashedPostState, postHash]);
    return targetPost
};


// TODO rewrite signature functions to leave less parametrs
const Post = ({ renderKey, post, name, text, createdAt, likesCount, repostsCount,
    handleLike, type, postHash, handleRepost, handleReply, hash }) => {

    let targetPost = useTargetPost(postHash);
    const subscribedState = useSelector(state => state.user.subscribed)

    const [subscribed, setSubscribed] = useState([]);
    const [postHashed, setPostHashed] = useState({});
    const [comments, setComments] = useState([]);
    const hashedPostState = useSelector(state => state.post.hashed);





    useEffect(() => {
        setPostHashed(hashedPostState);
    }, [hashedPostState, postHash]);


    const getCommentTreas = (hashMap, currentPostHash) => {
        const hashArr = Object.values(hashedPostState);
        const comments = [];

        const recursion = (hash) => {
            hashArr.map(post => {
                if (post.target.postHash === hash) {
                    comments.push(post);
                    recursion(post.hash);
                }
            })
        }
        recursion(currentPostHash);
        return comments;
    }

    useEffect(() => {
        const filterComment = Object.values(hashedPostState).filter(p => p.target?.postHash === hash && p.type === 'reply');
        const commentsTrees = getCommentTreas(postHashed, postHash);
        const commentsDateFilter = commentsTrees.sort((a, b) => a.createdAt - b.createdAt)
        console.log('commentsTrees', commentsTrees);
        setComments(commentsDateFilter);
    }, [hashedPostState, postHash]);

    useEffect(() => {
        setSubscribed(subscribedState)
    }, [])

    if (!postHash) {
        targetPost = {
            likesCount: likesCount,
            repostsCount: repostsCount
        }
    }


    const renderComments = comments.map((c, i) => {
        if (subscribed.includes(c.source.address) && i !== 3) {
            return (
                <CommentBlock
                    key={i}
                    renderKey={i}
                    removeLastLine={(+i + 1) === comments.length}
                    dotsLine={true}
                    name={c.source?.name}
                    text={c.text}
                    createdAt={c.createdAt}
                    showReactionBlock={true}
                    handleLike={() => handleLike(c)}
                    handleRepost={() => handleRepost(c)}
                    handleReply={() => handleReply(c)}
                    hash={c.hash}
                />
            )
        } else if (i === 3) {
            // TODO: clear this mock 
            return (
                <div key={i} className={styles.gap}>
                    <div className={styles.gapBlockLine}></div>
                    <span className={styles.gapTitle}>Show this thread</span>
                </div>
            )
            // TODO: add three dots! 
        }
    });

    console.log('hash&&&&&&&&&&7777777777777777777777777', hash);

    return (
        <div key={renderKey} >
            <div className={styles.post}>

                {type === 'post' && <>
                    <div className={styles.wrapperContent}>
                        <AuthorBlock name={name} createdAt={getReadFormat(createdAt)} />
                        <img src={icon.menu} alt="menu icon" className={styles.menuIcon} />
                    </div>
                    <PostContent sourceAddress={hash} text={text} />
                </>}
                {type === 'like' && targetPost && <> <LikeMark createdAt={getReadFormat(createdAt)} name={name} />
                    <div className={styles.wrapperContent}>
                        <AuthorBlock name={targetPost?.source?.name} createdAt={getReadFormat(targetPost.createdAt)} />
                    </div>
                    <PostContent sourceAddress={hash} text={targetPost?.text} />
                </>}
                {type === 'repost' && targetPost && <> <div className={styles.wrapperContent}>
                    <AuthorBlock name={name} createdAt={getReadFormat(createdAt)} />
                    <img src={icon.menu} alt="menu icon" className={styles.menuIcon} />
                </div>
                    <PostContent sourceAddress={hash} text={text} />
                    <RepostBlock postHash={postHash} />
                </>}

                <Reaction
                    likesCount={targetPost?.likesCount}
                    repostsCount={targetPost?.repostsCount}
                    handleLike={() => handleLike(post)}
                    handleRepost={() => handleRepost(post)}
                    handleReply={() => handleReply(post)} />
            </div>
            {comments &&
                <div className={styles.commentsWrapper}>
                    {renderComments}
                </div>
            }
        </div>
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