import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Post from "../../utils/Post/Post";
import routes from "../../../config/routes.config";
import styles from "./feed.module.scss";
import { postActions } from "./../../../api/storage/post";
import { handleSwitchPages } from "./../../helpers";
import { useLocation } from "react-router-dom";

import { getStreamPage, setStatusUser, userStatuses } from "./../../../api/customNpmPackage/signedLoader";

const Feed = ({ toggleTheme, promptToInstall }) => {
  const dispatch = useDispatch();
  const stream = useSelector((state) => state.post.stream);
  const subscribedSources = useSelector((state) => state.source.subscribed);
  const {
    isAuth,
    subscribed,
    source: userSource,
  } = useSelector((state) => state.user);
  const { alreadyLoadedPosts, loadedPosts } = useSelector((state) => state.post);

  const location = useLocation();

  const [openMenuHash, setOpenMenuHash] = useState(null);

  const [posts, setPosts] = useState([]);
  const postsBlock = useRef(null);
  let history = useHistory();

  useEffect(() => {
    toggleTheme(true);
  }, [toggleTheme]);

  // useEffect(() => {
  //   if (postsBlock.current) {
  //     postsBlock.current.style.maxHeight = window.outerHeight + "px";
  //   }

  //   if (location.state.currentScrollTop && postsBlock.current) {
  //     console.log("location.state.currentScrollTop");
  //     console.dir(location.state.currentScrollTop);

  //     postsBlock.current.scrollTo({
  //       top: location.state.currentScrollTop,
  //       behavior: "smooth",
  //     });
  //   }

  //   return () => {
  //     postsBlock.current = null;
  //   };
  // }, []);

  useEffect(() => {
    const callback = () => {
      setStatusUser(userStatuses.ACTIVE);
    };

    if (postsBlock.current) {
      postsBlock.current.style.maxHeight = window.outerHeight + "px";
      postsBlock.current.addEventListener("scroll", callback, { once: true });
    }

    window.addEventListener("scroll", callback, { once: true });
  }, []);

  useEffect(() => {
    setPosts([...stream]);

    // if (location.state.currentScrollTop && postsBlock.current) {
    //   console.log("location.state.currentScrollTop");
    //   console.dir(location.state.currentScrollTop);

    //   postsBlock.current.scrollTo({
    //     top: location.state.currentScrollTop,
    //     behavior: "smooth",
    //   });
    // }
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

  const updateNumberOfLoadedPosts = ({ lengthOfInternalRootPosts, lengthOfUserRootPosts }) => {
    dispatch(postActions.setAlreadyLoadedPosts(lengthOfUserRootPosts));
    dispatch(postActions.setLoadedPosts(lengthOfInternalRootPosts));
  }

  const handleShowLoadedPosts = () => {
    let sources = [];

    if (isAuth) {
      sources = [...subscribed, ...userSource];
    } else {
      sources = subscribedSources;
    }

    const stream = getStreamPage({
      postsSource: "",
      subscribedSources: sources,
      blacklistedSourcesByAddress: {},
      afterPost: {},
      endPost: {},
      limit: 10,
      callbackForUpdateStream: updateStream,
      callbackForUpdatePostsNumber: updateNumberOfLoadedPosts,
      showLoadedPosts: true,
    });

    updateStream({ stream });
  };

  const handleNextPage = () => {
    handleSwitchPages({
      element: postsBlock.current,
      postsStream: posts,
      next: true,
      isAuth,
      postsSource: "",
      subscribedSources,
      subscribed,
      userSource,
      blacklistedSourcesByAddress: {},
      limit: 10,
      callbackForUpdateStream: updateStream,
      callbackForUpdatePostsNumber: updateNumberOfLoadedPosts,
    });
  };

  const handleEditPost = (hash) => {
    // history.push(`${routes.newPost}?edit=${hash}`);
    history.push({
      pathname: routes.newPost,
      search: `?edit=${hash}`,
      state: {
        currentScrollTop: postsBlock.current.scrollTop,
      },
    });
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
      <div className={styles.louder}>{alreadyLoadedPosts} of {loadedPosts}</div>
      <button onClick={promptToInstall}>Add to Home screen</button>
      {loadedPosts - alreadyLoadedPosts !== 0 && (
        <button
          className={styles.showLoadedPostsButton}
          onClick={handleShowLoadedPosts}
        >
          Show New Loaded Posts {loadedPosts - alreadyLoadedPosts}
        </button>
      )}
      {posts && (
        <div
          ref={postsBlock}
          className={styles.postsWindow}
          onClick={(e) => handleMenuClose(e)}
        >
          {renderPosts}
        </div>
      )}
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
