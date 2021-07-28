import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Post from "../../utils/Post/Post";
// import style from "./feed.module.scss";
import routes from "../../../config/routes.config";

const Feed = ({ toggleTheme }) => {
  const stream = useSelector((state) => state.post.stream);
  const [openMenuHash, setOpenMenuHash] = useState(null);
  const [forceUpdate, setForceUpdate] = useState('');

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

  console.log('forceUpdate------------------', forceUpdate);
  console.log('post------------------', posts);

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
  // .slice()
  // .reverse()
  // TODO : refactor change less signature
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

  console.log("renderPosts", renderPosts);
  console.log("renderPosts.length", renderPosts.length);

  return (
    <>
      {posts && <div onClick={(e) => handleMenuClose(e)}>{renderPosts}</div>}
    </>
  );
};

export default Feed;
