import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Post from "../../utils/Post/Post";
import routes from "../../../config/routes.config";
import styles from "./feed.module.scss";
import { postActions } from "./../../../api/storage/post";
import { handleSwitchPages } from "./../../helpers";
import { useLocation } from "react-router-dom";

const Feed = ({ toggleTheme, promptToInstall }) => {
  const dispatch = useDispatch();
  const stream = useSelector((state) => state.post.stream);
  const subscribedSources = useSelector((state) => state.source.subscribed);
  const {
    isAuth,
    subscribed,
    source: userSource,
  } = useSelector((state) => state.user);
  const { currentAlreadySetNumber } = useSelector((state) => state.source);

  const location = useLocation();

  const [openMenuHash, setOpenMenuHash] = useState(null);

  const [posts, setPosts] = useState([]);
  const [isUserIdle, setIsUserIdle] = useState(true);
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
      setIsUserIdle(false);
    };

    if (postsBlock.current) {
      postsBlock.current.style.maxHeight = window.outerHeight + "px";
      postsBlock.current.addEventListener("scroll", callback);
    }

    return () => {
      if (postsBlock.current) {
        postsBlock.current.removeEventListener("scroll", callback);
        postsBlock.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (posts.length !== 10) {
      setPosts([...stream]);
    }

    const every5sec = setInterval(() => {
      console.log("EVERY 5 seconds ", isUserIdle);
      if (isUserIdle) {
        setPosts([...stream]);
      } else {
        clearInterval(every5sec);
      }
    }, 5000);

    // if (location.state.currentScrollTop && postsBlock.current) {
    //   console.log("location.state.currentScrollTop");
    //   console.dir(location.state.currentScrollTop);

    //   postsBlock.current.scrollTo({
    //     top: location.state.currentScrollTop,
    //     behavior: "smooth",
    //   });
    // }

    return () => {
      clearInterval(every5sec);
    };
  }, [stream, isUserIdle]);

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
      <div className={styles.louder}>{currentAlreadySetNumber}</div>
      <button onClick={promptToInstall}>Add to Home screen</button>
      <button
        className={styles.PreviousPageButton}
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
