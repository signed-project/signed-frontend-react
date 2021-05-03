import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types'
import AuthorBlock from '../AuthorBlock/AuthorBlock';
import InfoAuthor from '../InfoAuthor/InfoAuthor';
import Avatar from '../Avatar/Avatar';
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

    console.log('targetPost', targetPost);

    const [subscribed, setSubscribed] = useState([]);
    const [postMap, setPostMap] = useState({});
    const [comments, setComments] = useState([]);
    const postMapState = useSelector(state => state.post.hashed);

    useEffect(() => {
        setPostMap(postMapState);
    }, [postMapState, postHash]);

    const getCommentTreas = (currentPostHash) => {
        const postArr = Object.values(postMap);
        const comments = [];

        const recursion = (hash) => {
            postArr.map(post => {
                if (post.target.postHash === hash && post.type === 'reply') {
                    console.log('post$$$$$$$$$$$$$$$$$$$$$$$$$$$$$', post);
                    comments.push(post);
                    recursion(post.hash);
                }
            })
        }
        recursion(currentPostHash);
        return comments;
    }

    useEffect(() => {
        const commentsTrees = getCommentTreas(hash);
        const commentsDateFilter = commentsTrees.sort((a, b) => a.createdAt - b.createdAt)
        console.log('commentsTrees', commentsTrees);
        setComments(commentsDateFilter);
    }, [postMap, hash]);

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
                    removeLastLine={(i + 1) === comments.length}
                    dotsLine={true}
                    name={c.source?.name}
                    text={c.text}
                    createdAt={c.createdAt}
                    showReactionBlock={true}
                    handleLike={() => handleLike(c)}
                    handleRepost={() => handleRepost(c)}
                    handleReply={() => handleReply(c)}
                    hash={c.hash}
                    type={c.type}
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

    /*
      <div className={styles.commentBlock}>
                <div className={styles.avatarBlock}>
                    <Avatar />
                    <div className={`${styles.verticalLine} ${removeLastLine && styles.verticalLineRemove}`}></div>
                </div>
                <div className={styles.postBody}>
                    <InfoAuthor createdAt={getReadFormat(createdAt)} name={name} />
                    <div className={styles.bodyWrapper}>
                        <PostContent sourceAddress={hash} text={text} type={type} />
                    </div>
    
    {
        showReactionBlock &&
        <Reaction
            likesCount={likesCount}
            repostsCount={repostsCount}
            handleLike={handleLike}
            handleRepost={handleRepost}
            handleReply={handleReply} />
    }
                </div >
            </div >
    
    */


    const isShowLine = () => {
        let res = false;
        if (comments.length > 1 && type !== 'like') {
            res = true;
        }
        return res
    }

    const isHideLine = comments.length < 1;

    console.log('comments', comments.length);
    console.log('isHideLine', targetPost?.type);
    console.log('type', targetPost?.type);

    return (
        <div key={renderKey} className={styles.post} >
            {type === 'post' && <>
                {/*  ${removeLastLine && styles.verticalLineRemove} */}
                <div className={styles.typePost}>
                    <div className={styles.avatarBlock}>
                        <Avatar />
                        <div className={`${styles.verticalLine}  ${isHideLine && styles.verticalLineRemove}
                          ${type === 'like' && styles.verticalLineRemove}
                       
                          `}></div>
                    </div>
                    <div className={styles.postMain}>
                        <div className={styles.hover}>
                            <InfoAuthor createdAt={getReadFormat(createdAt)} name={name} />
                            <img src={icon.menu} alt="menu icon" className={styles.menuIcon} />
                        </div>
                        <div className={styles.bodyWrapper}>
                            <PostContent sourceAddress={hash} text={text} type={type} />
                        </div>
                        <Reaction
                            likesCount={targetPost?.likesCount}
                            repostsCount={targetPost?.repostsCount}
                            handleLike={() => handleLike(post)}
                            handleRepost={() => handleRepost(post)}
                            handleReply={() => handleReply(post)} />
                    </div>
                </div>
            </>}

            {type === 'like' && targetPost && <>
                <div className={styles.typeLike}>
                    <LikeMark createdAt={getReadFormat(createdAt)} name={name} />
                    <div className={styles.avatarWrapper}>
                        <div className={styles.avatarBlock}>
                            <Avatar />
                            <div className={`${styles.verticalLine}    ${type === 'like' && styles.verticalLineRemove}`}></div>
                        </div>
                        <div className={styles.postBody}>
                            <div className={styles.hover}>
                                <InfoAuthor createdAt={getReadFormat(createdAt)} name={name} />
                            </div>
                            <div className={styles.bodyWrapper}>
                                <PostContent sourceAddress={hash} text={targetPost?.text} type={type} />
                            </div>
                            <Reaction
                                likesCount={targetPost?.likesCount}
                                repostsCount={targetPost?.repostsCount}
                                handleLike={() => handleLike(post)}
                                handleRepost={() => handleRepost(post)}
                                handleReply={() => handleReply(post)} />
                        </div>

                    </div>
                </div>




                {/*             <LikeMark createdAt={getReadFormat(createdAt)} name={name} />
                    <div className={styles.wrapperContent}>
                        <AuthorBlock name={targetPost?.source?.name} createdAt={getReadFormat(targetPost.createdAt)} />
                    </div>
                    <PostContent sourceAddress={hash} text={targetPost?.text} type={type} /> */}
            </>}
            {/*
                {type === 'repost' && targetPost && <> <div className={styles.wrapperContent}>
                    <AuthorBlock name={name} createdAt={getReadFormat(createdAt)} />
                    <img src={icon.menu} alt="menu icon" className={styles.menuIcon} />
                </div>
                    <PostContent sourceAddress={hash} text={text} type={type} />
                    <RepostBlock postHash={postHash} />
                </>} */}

            {/* <Reaction
                    likesCount={targetPost?.likesCount}
                    repostsCount={targetPost?.repostsCount}
                    handleLike={() => handleLike(post)}
                    handleRepost={() => handleRepost(post)}
                    handleReply={() => handleReply(post)} /> */}

            {
                comments &&
                <div className={styles.commentsWrapper}>
                    {renderComments}
                </div>
            }
        </div >
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