import React, { useEffect, useState } from 'react';
import { Link, NavLink, useHistory } from "react-router-dom";
import styles from '../source.module.scss';
import Post from '../../../utils/Post/Post';
import routes from "../../../../config/routes.config";



const ProfilePosts = ({ ownPost }) => {
 
    let history = useHistory();
    const handleShowMenu = (hash) => {
        setOpenMenuHash(hash);
    };
    const [openMenuHash, setOpenMenuHash] = useState(null);
    const isShowMenu = (hash) => {
        return hash === openMenuHash ? true : false;
    };

    const handleMenuClose = (e) => {
        const dataHash = e.target.getAttribute("data-hash");
        if (dataHash) {
            return;
        } else {
            setOpenMenuHash(null);
        }
    };

    const handleEditPost = (hash) => {
        history.push(`${routes.newPost}?edit=${hash}`);
    };

    const renderPosts = ownPost.slice().map((p, i) => {
        return (
            <Post
                post={p}
                avatar={p.source.avatar}
                key={i}
                renderKey={i}
                type={p.type}
                name={p.source.name}
                text={p.text}
                postHash={p?.target?.postHash}
                createdAt={p.createdAt}
                likesCount={p.likesCount}
                repostsCount={p.repostsCount}
                attachments={p.attachments}
                hash={p.hash}
                handleShowMenu={handleShowMenu}
                isShowMenu={isShowMenu}
                handleEditPost={handleEditPost}
            />
        );
    });


    return (
        <>
            {/* <div onClick={(e) => handleMenuClose(e)}> */}
            <div>
                {ownPost.length > 0 && renderPosts}
            </div>
        </>
    );
};

export default ProfilePosts;
