
import React, { useEffect, useState } from 'react';
import { Link, NavLink, useHistory } from "react-router-dom";
import Notification from '../../../utils/Notification/Notification';




const AllNotification = ({ inbox }) => {
    let history = useHistory();

    console.log('inbox', inbox);

    const renderPosts = inbox.slice().map((p, i) => {
        return (
            <Notification
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
            // handleShowMenu={handleShowMenu}
            // isShowMenu={isShowMenu}
            // handleEditPost={handleEditPost}
            />
        );
    });


    return (
        <>
            {/* <div onClick={(e) => handleMenuClose(e)}> */}
            <div>
                {inbox.length > 0 && renderPosts}
            </div>
        </>
    );
};

export default AllNotification;
