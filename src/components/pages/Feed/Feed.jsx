import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Post from "../../utils/Post/Post";
import routes from "../../../config/routes.config";
import styles from './feed.module.scss';
import { sourceActions } from "../../../api/storage/source";
import { postActions } from "../../../api/storage/post";
import { loadedStreamActions } from "../../../api/storage/loadedStream";
import { getDefaultSources, getSourcesIndex } from '../../../api/customNpmPackage/loadIndexes';
import { userApi, hostApi } from '../../../config/http.config';
 
const apiHost = hostApi.API_HOST;

const Feed = ({ toggleTheme }) => {
  // TODO: state for hour constanta & current time!
  const stream = useSelector((state) => state.post.stream);
  const { isAuth, subscribed, source: userSource } = useSelector((state) => state.user);
  const { allReceivedNumber, currentAlreadySetNumber } = useSelector((state) => state.source);
  const loadedStream = useSelector((state) => state.loadedStream);

  console.log('currentAlreadySetNumber', currentAlreadySetNumber);

  const [openMenuHash, setOpenMenuHash] = useState(null);

  const [posts, setPosts] = useState([]);
  const [hoursConstanta, setHoursConstanta] = useState(1);
  const [currentTime, setCurrentTime] = useState(new Date(1630826929000));

  let history = useHistory();
  const dispatch = useDispatch();

  const setAllReceivedSourcesNumber = (number) => {
    dispatch(sourceActions.setAllReceivedNumber(number));
  }

  const setCurrentAlreadySetSourcesNumber = (number) => {
    dispatch(sourceActions.setCurrentAlreadySetNumber(number));
  }

  const addTempPostArr = (postsArr) => {
    dispatch(postActions.addTempPost(postsArr));
  }

  const setAddTempSourceItem = (sourceItem) => {
    dispatch(sourceActions.addTempSourceItem(sourceItem));
  }

  const setLoadedStream = (loadedStream) => {
    dispatch(loadedStreamActions.setLoadedStream(loadedStream));
  }

  useEffect(() => {
    setCurrentTime(new Date(currentTime.setHours(currentTime.getHours() - hoursConstanta)));

    const counter = setInterval(() => {
      setHoursConstanta((hoursConstanta) => hoursConstanta + 1);
    }, 3000)

    return () => {
      clearInterval(counter);
    }
  }, []);

  useEffect(() => {
    console.log('hoursConstanta');
    console.dir(hoursConstanta);
    setCurrentTime(new Date(currentTime.setHours(currentTime.getHours() - hoursConstanta)))
  }, [hoursConstanta]);

  useEffect(() => {
    console.log('currentTime');
    console.dir(currentTime);
    dispatch(postActions.getIndex({ isRegistered: isAuth, currentTime }));
  }, [currentTime]);

  useEffect(() => {
    // TODO: if we have loaded stream we can avoid to do it
    if (!loadedStream.archives.length && !loadedStream.recentPosts.posts.length) {
      if (!isAuth) {
        (async () => {
          await getDefaultSources({
            dispatch, 
            setAllReceivedSourcesNumber, 
            setCurrentAlreadySetSourcesNumber,
            addTempPostArr, 
            setAddTempSourceItem, 
            getSubscribedPath: `${apiHost}${userApi.SUBSCRIBED}`,
            setLoadedStream,
          })
        })().then(() => {
          dispatch(postActions.getIndex({ isRegistered: false, currentTime }));
        });
      }
      else {
        (async () => {
          await getSourcesIndex({
            sources: [...subscribed, userSource], 
            setAllReceivedSourcesNumber,
            setCurrentAlreadySetSourcesNumber, 
            addTempPostArr, 
            setAddTempSourceItem,
            setLoadedStream,
          })
        })().then(() => {
          dispatch(postActions.getIndex({ isRegistered: false, currentTime }));
        });
      }
    }
  }, [isAuth]);

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
    </>
  );
};

export default Feed;
