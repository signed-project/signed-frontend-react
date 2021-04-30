import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Link, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'
import icon from '../../../assets/svg/icon';
import Avatar from '../../utils/Avatar/Avatar';
import style from './postPage.module.scss';
import Button from '../../utils/Button/Button';
import { postActions } from '../../../api/storage/post';
import { Post as PostModel } from '../../../api/models/post';
import queryString from "query-string";
import { useLocation } from "react-router-dom";
import Post from '../../utils/Post/Post';
import RepostBlock from '../../utils/Post/RepostBlock';
import CommentBlock from '../../utils/Post/CommentBlock';
import routes from '../../../config/routes.config.js';
import InfoAuthor from '../../utils/InfoAuthor/InfoAuthor';
import Checkbox from '../../utils/Checkbox/Checkbox';



const PostPage = ({ toggleTheme }) => {
    const user = useSelector(state => state.user);
    const hashedPost = useSelector(state => state.post.hashed);
    const location = useLocation();
    const { post: hash, user: source, type } = queryString.parse(location.search);


    const history = useHistory();
    const dispatch = useDispatch();


    const [post, setPost] = useState({
        type: 'post',
        hash: '',
        source: '',
        isComment: false
    });

    const [comments, setComments] = useState([])

    useEffect(() => {
        toggleTheme(false);
    }, [toggleTheme]);

    useEffect(() => {
        setPost(prev => ({
            ...prev,
            type,
            hash,
            source,
        }))
    }, [hash, source, type]);





    const getMentions = () => {
        const mentions = [];
        comments.map(post => {
            if (post.isMention) {
                mentions.push(post.source)
            }
        })
        console.log('mentions))))))))))))))))))))))', mentions);
        return mentions;
    }

 


    const renderComments = comments.slice().reverse().map((post, i) =>
    (
        <CommentBlock
            key={i}
            img={post?.source?.avatar?.hash}
            name={post.source?.name}
            text={post.text}
            createdAt={post.createdAt}
        />
    ));


    return (
        <>
            <div className={style.backBlock}>
                <img src={icon.arrowBack} onClick={() => history.goBack()} alt="arrow back icon" />
            </div>

            <div className={style.bodyBlock}>

            </div>

        </>
    );
};

export default PostPage;
