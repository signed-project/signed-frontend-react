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
const Post = ({ key, post, name, text, createdAt, likesCount, repostsCount,
    handleLike, type, postHash, handleRepost, handleReply, hash }) => {

    let targetPost = useTargetPost(postHash);
    const subscribedState = useSelector(state => state.user.subscribed)

    const [subscribed, setSubscribed] = useState([]);
    const [postHashed, setPostHashed] = useState({});
    const [comments, setComments] = useState([]);
    const hashedPostState = useSelector(state => state.post.hashed);

    useEffect(() => {
        setPostHashed(hashedPostState);
        console.log('hash++++++++++++++++++++++++', hash);
        console.log('hash++++++++++++++++++++++++', type);
        const filterComment = Object.values(hashedPostState).filter(p => p.target?.postHash === hash && p.type === 'reply');
        setComments(filterComment);
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
        console.log('!!!!!!!!!!!!!!!!!c', c);
        if (subscribed.includes(c.source.address)) {
            return (<>
                <CommentBlock
                    key={i}
                    removeLastLine={(+i + 1) === comments.length}
                    dotsLine={true}
                    name={c.source?.name}
                    text={c.text}
                    createdAt={c.createdAt}
                    showReactionBlock={true}
                    handleLike={() => handleLike(c)}
                    handleRepost={() => handleRepost(c)}
                    handleReply={() => handleReply(c)}
                />
            </>)
        }


    });


    return (
        <>
            <div key={key} className={styles.post}>

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
                    handleLike={() => handleLike(post)}
                    handleRepost={() => handleRepost(post)}
                    handleReply={() => handleReply(post)} />
            </div>
            {comments &&
                <>
                    <div className={styles.commentsWrapper}>
                        {renderComments}
                        {comments.length > 2 &&
                            <Button className='clean_white' onClick={() => handleLike()} > Show more</Button>}
                    </div>
                </>
            }
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