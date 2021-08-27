import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Notification from "../../../utils/Notification/Notification";

const AllNotification = ({ inbox }) => {
  const { source } = useSelector((state) => state.user);

  console.log("inbox##############", inbox);

  const renderPosts = inbox
    .slice()
    .filter((data) => data?.post?.source?.address !== source?.address)
    .map((notification, i) => {
      console.log("notification!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", notification);
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
      <div>{source?.address && inbox.length > 0 && renderPosts}</div>
    </>
  );
};

export default AllNotification;
