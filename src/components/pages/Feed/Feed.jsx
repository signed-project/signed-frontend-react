import React, { useEffect, useRef, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Post from "../../utils/Post/Post";
import { routes } from "../../../config/routes.config";
import styles from "./feed.module.scss";
import { postActions } from "./../../../api/storage/post";
import { handleSwitchPages } from "./../../helpers";

import { RouterContext } from "../../layout/RouterProvider";
import { LayoutContext } from "../../layout/LayoutProvider";

import { getStreamPage, setStatusUser, userStatuses } from "./../../../api/customNpmPackage/signedLoader";

const Feed = () => {
  const layoutContext = useContext(LayoutContext)
  const routerContext = useContext(RouterContext);
  const dispatch = useDispatch();
  let history = useHistory();

  const stream = useSelector((state) => state.post.stream);
  const subscribedSources = useSelector((state) => state.source.subscribed);
  const {
    isAuth,
    subscribed,
    source: userSource,
  } = useSelector((state) => state.user);
  const { alreadyLoadedPosts, loadedPosts } = useSelector((state) => state.post);

  const [openMenuHash, setOpenMenuHash] = useState(null);
  const [posts, setPosts] = useState([]);

  const postsBlock = useRef(null);

  useEffect(() => {
    layoutContext.toggleTheme(true);
  }, [layoutContext]);

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
    if (stream.length > 0) {
      setPosts([...stream]);
    }
  }, [stream]);

  useEffect(() => {
    let timeout = 0;

    if (
      routerContext.state.stateRouter.elementId &&
      (routerContext.state.stateRouter.scrollTopElement || routerContext.state.stateRouter.scrollTopElement === 0) &&
      (routerContext.state.stateRouter.scrollTopWindow || routerContext.state.stateRouter.scrollTopWindow === 0)
    ) {
      timeout = setTimeout(() => {
        let element = document.getElementById(routerContext.state.stateRouter.elementId);

        if (element) {
          postsBlock.current.scrollTo({
            top: routerContext.state.stateRouter.scrollTopElement
          });
          window.scrollTo({
            top: routerContext.state.stateRouter.scrollTopWindow
          });

          routerContext.updateStateRouter({ elementId: "", scrollTopElement: null, scrollTopWindow: null });
        }
      }, 0)
    }

    return () => {
      clearTimeout(timeout);
    }
  }, [posts]);

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

  const handlePreviousPage = () => {
    handleSwitchPages({
      element: postsBlock.current,
      postsStream: posts,
      next: false,
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

  const handleEditPost = (hash, id) => {
    history.push({
      pathname: routes.newPost,
      search: `?edit=${hash}`,
      state: {
        elementId: id,
        scrollTopElement: postsBlock.current.scrollTop,
        scrollTopWindow: window.scrollY,
      },
    });
  };

  const updateRouterContext = () => {
    routerContext.updateStateRouter({ 
      scrollTopElement: postsBlock.current.scrollTop, 
      scrollTopWindow: window.scrollY 
    });
  };

  const renderPosts = () => {
    return posts.map((p, i) => {
      return (
        <Post
          key={i}
          renderKey={i}
          post={p}
          id={p.rootPost.id}
          updateRouterContext={updateRouterContext}
          handleShowMenu={handleShowMenu}
          isShowMenu={isShowMenu}
          handleEditPost={handleEditPost}
        />
      );
    });
  };

  return (
    <>
      <div className={styles.louder}>{alreadyLoadedPosts} of {loadedPosts}</div>
      <button onClick={layoutContext.promptToInstall}>Add to Home screen</button>
      {loadedPosts - alreadyLoadedPosts !== 0 && (
        <button
          className={styles.showLoadedPostsButton}
          onClick={handleShowLoadedPosts}
        >
          Show New Loaded Posts {loadedPosts - alreadyLoadedPosts}
        </button>
      )}
      <button
        className={styles.previousPage}
        onClick={() => handlePreviousPage()}
      >
        PREVIOUS PAGE
      </button>
      {posts && (
        <div
          ref={postsBlock}
          className={styles.postsWindow}
          onClick={(e) => handleMenuClose(e)}
        >
          {renderPosts()}
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
