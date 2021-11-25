import React, { useEffect, useState } from 'react';
import { Link, NavLink, useHistory } from "react-router-dom";
import styles from '../source.module.scss';
import Post from '../../../utils/Post/Post';
import routes from "../../../../config/routes.config";



const ProfilePosts = ({ ownPost, handleNextPage, handlePreviousPage }) => {
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

    const handleEditPost = (hash, id) => {
        history.push(`${routes.newPost}?edit=${hash}`);
    };

    const renderPosts = ownPost.map((p, i) => {
        return (
            <Post
                post={p}
                avatar={p.rootPost.source.avatar}
                key={i}
                renderKey={i}
                type={p.rootPost.type}
                name={p.rootPost.source.name}
                text={p.rootPost.text}
                postHash={p.rootPost?.target?.postHash}
                createdAt={p.rootPost.createdAt}
                likesCount={p.rootPost.likesCount}
                repostsCount={p.rootPost.repostsCount}
                attachments={p.rootPost.attachments}
                hash={p.rootPost.hash}
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
            <button className={styles.previousPage} onClick={handlePreviousPage}>PREVIOUS PAGE</button>
                {ownPost.length > 0 && renderPosts}
                <button className={styles.nextPageButton} onClick={handleNextPage}>NEXT PAGE</button>
            </div>
        </>
    );
};

export default ProfilePosts;
