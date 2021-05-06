import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import icon from '../../../assets/svg/icon';
import styles from './postPage.module.scss';
import { useLocation, useParams, useHistory } from "react-router-dom";
import RepostBlock from '../../utils/Post/RepostBlock';
import CommentBlock from '../../utils/Post/CommentBlock';
import AuthorBlock from '../../utils/AuthorBlock/AuthorBlock';
import { getReadFormat } from '../../../libs/date.js';
import Reaction from '../../utils/Reaction/Reaction';
import PostContent from '../../utils/PostContent/PostContent';
import useReaction from '../../customHooks/useReaction';
import getCommentTrees from '../../customHooks/getCommentTrees';


const PostPage = ({ toggleTheme }) => {
    const user = useSelector(state => state.user);
    const postMapState = useSelector(state => state.post.hashed);
    const location = useLocation();
    // const { post: hash, user: source, type } = queryString.parse(location.search);
    let { hash } = useParams();
    const history = useHistory();
    const reaction = useReaction();

    const [post, setPost] = useState('');
    const [comments, setComments] = useState([]);

    useEffect(() => {
        toggleTheme(false);
    }, [toggleTheme]);

    useEffect(() => {
        const currentPost = postMapState[hash];
        setPost(currentPost);
    }, [hash, postMapState]);

    useEffect(() => {
        const commentsTrees = getCommentTrees({ hashMap: postMapState, currentHash: hash });
        setComments(commentsTrees);
    }, [postMapState, hash]);

    const renderComments = comments.slice().map((post, i) =>
    (
        <CommentBlock
            type={post.type}
            key={i}
            img={post?.source?.avatar?.hash}
            name={post.source?.name}
            text={post.text}
            createdAt={post.createdAt}
            removeLastLine={comments.length === i + 1}
        />
    ));

    return (
        <>
            <div className={styles.backBlock}>
                <img src={icon.arrowBack} onClick={() => history.goBack()} alt="arrow back icon" />
            </div>
            { post &&
                <div className={styles.bodyBlock}>
                    <div className={styles.wrapperContent}>
                        <AuthorBlock name={post.name} createdAt={getReadFormat(post.createdAt)} />
                        <img src={icon.menu} alt="menu icon" className={styles.menuIcon} />
                    </div>
                    <PostContent sourceAddress={hash} text={post.text} type={post.type} />
                    <Reaction
                        likesCount={post.likesCount}
                        repostsCount={post.repostsCount}
                        handleLike={() => reaction.handleLike(post)}
                        handleRepost={() => reaction.handleRepost(post)}
                        handleReply={() => reaction.handleReply(post)} />

                    {post?.type === 'repost' &&
                        <div className={styles.repostBlockWrapper}>
                            <RepostBlock postHash={post.target.postHash} />
                        </div>}
                    {comments.length > 0 &&
                        <div className={styles.commentsWrapper}>
                            {renderComments}
                        </div>
                    }

                </div>
            }
        </>
    );
};

export default PostPage;
