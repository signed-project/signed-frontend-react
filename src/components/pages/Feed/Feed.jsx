import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Post from "../../utils/Post/Post";
import routes from "../../../config/routes.config";
import styles from './feed.module.scss';
import { getStreamPage } from './../../../api/customNpmPackage/signedLoader';
import axios from "axios";
import { postActions } from "./../../../api/storage/post";
import { sourceActions } from "./../../../api/storage/source";
import { hostApi, userApi } from "./../../../config/http.config.js";

const apiHost = hostApi.API_HOST;

const Feed = ({ toggleTheme }) => {
  const dispatch = useDispatch();
  const stream = useSelector((state) => state.post.stream);
  const { isAuth, subscribed, source: userSource } = useSelector(state => state.user);
  const { allReceivedNumber, currentAlreadySetNumber } = useSelector((state) => state.source);

  console.log('currentAlreadySetNumber', currentAlreadySetNumber);

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

  const updateStream = ({ stream, sourcePost }) => {
    console.log('|---------- updateStream -----------|');
    console.dir(stream);
    dispatch(postActions.updatePostStream(stream));
    if (sourcePost) {
      dispatch(sourceActions.setLatestSource(sourcePost));
    }
  }

  const handleNextPage = () => {
    console.log('AFTER POST');
    console.dir(posts.at(-1).rootPost);

    const afterPost = posts.at(-1).rootPost;

    if (!isAuth) {
      (async ()=> {
        try {
          const { data } = await axios.get(`${apiHost}${userApi.SUBSCRIBED}`);

          const stream = getStreamPage({ 
            subscribedSources: data, 
            blacklistedSourcesByAddress: {}, 
            afterPost,
            limit: 10,
            callback: updateStream 
          });

          updateStream({ stream });

          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        } catch (e) {
          console.warn("[Layout][useEffect-52-line]", e);
        }
      })();
    } else {
      const stream = getStreamPage({ 
        subscribedSources: [...subscribed, userSource], 
        blacklistedSourcesByAddress: {}, 
        afterPost,
        limit: 10,
        callback: updateStream 
      });

      updateStream({ stream });

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }

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
        {currentAlreadySetNumber} of  {allReceivedNumber}
      </div>
      {posts && <div onClick={(e) => handleMenuClose(e)}>{renderPosts}</div>}
      <button className={styles.nextPageButton} onClick={() => handleNextPage()}>NEXT PAGE</button>
    </>
  );
};

export default Feed;
