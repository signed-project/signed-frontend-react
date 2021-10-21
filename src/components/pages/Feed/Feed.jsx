import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Post from "../../utils/Post/Post";
import routes from "../../../config/routes.config";
import styles from './feed.module.scss';


const Feed = ({ toggleTheme }) => {
  const stream = useSelector((state) => state.post.stream);
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
