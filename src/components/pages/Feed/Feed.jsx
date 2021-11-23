import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Post from "../../utils/Post/Post";
import routes from "../../../config/routes.config";
import styles from "./feed.module.scss";
import { postActions } from "./../../../api/storage/post";
import { handleSwitchPages } from "./../../helpers";

const Feed = ({ toggleTheme, promptToInstall }) => {
  const dispatch = useDispatch();
  const stream = useSelector((state) => state.post.stream);
  const subscribedSources = useSelector((state) => state.source.subscribed);
  const {
    isAuth,
    subscribed,
    source: userSource,
  } = useSelector((state) => state.user);
  const { allReceivedNumber, currentAlreadySetNumber } = useSelector(
    (state) => state.source
  );

  const [openMenuHash, setOpenMenuHash] = useState(null);

  const [posts, setPosts] = useState([]);
  let history = useHistory();

  useEffect(() => {
    toggleTheme(true);
  }, [toggleTheme]);

  useEffect(() => {
    setPosts([...stream]);
  }, [stream]);

  const handleShowMenu = (hash) => {
    setOpenMenuHash(hash);
  };

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

  const updateStream = ({ stream }) => {
    dispatch(postActions.updatePostStream(stream));
  };

  const handlePreviousPage = () => {
    handleSwitchPages({
      postsStream: posts,
      next: false,
      isAuth,
      postsSource: "",
      subscribedSources,
      subscribed,
      userSource,
      blacklistedSourcesByAddress: {},
      limit: 10,
      callback: updateStream,
    });
  };

  const handleNextPage = () => {
    handleSwitchPages({
      postsStream: posts,
      next: true,
      isAuth,
      postsSource: "",
      subscribedSources,
      subscribed,
      userSource,
      blacklistedSourcesByAddress: {},
      limit: 10,
      callback: updateStream,
    });
  };

  const handleEditPost = (hash) => {
    history.push(`${routes.newPost}?edit=${hash}`);
  };

  const renderPosts = posts.map((p, i) => {
    return (
      <Post
        key={i}
        renderKey={i}
        post={p}
        handleShowMenu={handleShowMenu}
        isShowMenu={isShowMenu}
        handleEditPost={handleEditPost}
      />
    );
  });

  return (
    <>
      <div className={styles.louder}>
        {currentAlreadySetNumber} of {allReceivedNumber}
      </div>
      <button onClick={promptToInstall}>Add to Home screen</button>
      <button
        className={styles.PreviousPageButton}
        onClick={() => handlePreviousPage()}
      >
        PREVIOUS PAGE
      </button>
      {posts && <div onClick={(e) => handleMenuClose(e)}>{renderPosts}</div>}
      <button
        className={styles.nextPageButton}
        onClick={() => handleNextPage()}
      >
        NEXT PAGE
      </button>
    </>
  );
};

export default Feed;
