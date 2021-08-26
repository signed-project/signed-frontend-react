
import React, { useEffect, useState } from 'react';
import Notification from '../../../utils/Notification/Notification';



const AllNotification = ({ inbox }) => {
    const renderPosts = inbox.slice().map((notification, i) => {
        console.log('notification!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', notification);
        // const p = notification.post;
        const p = notification.post;
        const status = notification.status;
        return (
            <Notification
                destinationAddress={notification.address}
                status={status}
                post={p}
                key={i}
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
