import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'
import icon from '../../../assets/svg/icon';
import Avatar from '../../utils/Avatar/Avatar';
import styles from './postPage.module.scss';
import Button from '../../utils/Button/Button';
import { postActions } from '../../../api/storage/post';
import { Post as PostModel } from '../../../api/models/post';
import queryString from "query-string";
import { useLocation, useParams, useHistory } from "react-router-dom";
import Post from '../../utils/Post/Post';
import RepostBlock from '../../utils/Post/RepostBlock';
import CommentBlock from '../../utils/Post/CommentBlock';
import routes from '../../../config/routes.config.js';
import InfoAuthor from '../../utils/InfoAuthor/InfoAuthor';
import Checkbox from '../../utils/Checkbox/Checkbox';
import AuthorBlock from '../../utils/AuthorBlock/AuthorBlock';
import { getReadFormat } from '../../../libs/date.js';
import Reaction from '../../utils/Reaction/Reaction';
import PostContent from '../../utils/PostContent/PostContent';
import useReaction from '../customHooks/useReaction';

const PostPage = ({ toggleTheme }) => {
    const user = useSelector(state => state.user);
    const postMapState = useSelector(state => state.post.hashed);
    const location = useLocation();
    // const { post: hash, user: source, type } = queryString.parse(location.search);
    let { hash } = useParams();
    const history = useHistory();
    const dispatch = useDispatch();
    const reaction = useReaction();

    const [post, setPost] = useState('');

    const [postMap, setPostMap] = useState({});
    const [comments, setComments] = useState([]);

    useEffect(() => {
        toggleTheme(false);
    }, [toggleTheme]);


    useEffect(() => {
        const currentPost = postMapState[hash];
        setPost(currentPost);
    }, [hash, postMapState]);


    console.log('post^^^^^^^^^^^^^^^^^^^^', post);

    const getCommentTreas = (currentPostHash) => {
        const postArr = Object.values(postMapState);
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
    }, [postMapState, hash]);


    const handleLike = (p) => {
        let data;
        if (p.type === 'post' || p.type === 'reply') {
            data = {
                source: user.source,
                type: 'like',
                wfi: user.wfi,
                target: {
                    "sourceHash": p.source.hash,
                    "postHash": p.hash
                }
            }
        }
        else {
            const postData = postMapState[p?.target?.postHash];
            data = {
                ...postData,
                type: 'like',
                wfi: user.wfi,
                target: {
                    sourceHash: postData.source.hash,
                    postHash: postData.hash
                }
            }
        };
        const post = new PostModel(data);
        const likePost = post.newPost;
        dispatch(postActions.sendPost(likePost));
    };

    const handleRepost = (p) => {
        let sourcePost
        let sourceAddress
        if (p.type === 'post' || p.type === 'reply') {
            sourcePost = p.hash;
            sourceAddress = p.source.address;
        } else {
            sourcePost = p.target.postHash;
            sourceAddress = p.target.sourceHash;
        }
        const type = 'repost';
        history.push(`${routes.repost}?post=${sourcePost}&user=${sourceAddress}&type=${type}`);
    };

    const handleReply = (p) => {
        let sourcePost
        let sourceAddress
        if (p.type === 'post' || p.type === 'reply' || p.type === 'repost') {
            sourcePost = p.hash;
            sourceAddress = p.source.address;
        } else {
            sourcePost = p.target.postHash;
            sourceAddress = p.target.sourceHash;
        }
        const type = 'reply';
        history.push(`${routes.repost}?post=${sourcePost}&user=${sourceAddress}&type=${type}`);
    }




    const renderComments = comments.slice().reverse().map((post, i) =>
    (
        <CommentBlock
            type={post.type}
            key={i}
            img={post?.source?.avatar?.hash}
            name={post.source?.name}
            text={post.text}
            createdAt={post.createdAt}
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
                        handleRepost={() => handleRepost(post)}
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
