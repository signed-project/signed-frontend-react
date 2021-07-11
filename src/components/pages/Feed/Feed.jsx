import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, NavLink, useHistory } from "react-router-dom";

import Post from "../../utils/Post/Post";
import style from "./feed.module.scss";
import routes from "../../../config/routes.config";

const Feed = ({ toggleTheme }) => {
  const hashedPostMap = useSelector((state) => state.post.hashed);
  const stream = useSelector((state) => state.post.stream);

  console.log('stream-------stream---------stream---------stream', stream);

  const [openMenuHash, setOpenMenuHash] = useState(null);

  const [posts, setPosts] = useState([]);
  let history = useHistory();

  console.log('________stream________feed--------!!!', stream);

  useEffect(() => {
    toggleTheme(true);
  }, [toggleTheme]);

  useEffect(() => {
    setPosts(stream);
  }, [stream]);

  console.log('posts', posts);

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

  // TODO : refactor change less signature
  const renderPosts = posts
    .slice()
    // .reverse()
    .map((p, i) => {

      return (
        <Post
          post={p}
          key={i}
          renderKey={i}
          type={p.type}
          name={p.source.name}
          text={p.text}
          postHash={p?.target?.postHash}
          createdAt={p.createdAt}
          likesCount={p.likesCount}
          repostsCount={p.repostsCount}
          attachments={p.attachments}
          hash={p.hash}
          handleShowMenu={handleShowMenu}
          isShowMenu={isShowMenu}
          handleEditPost={handleEditPost}
        />
      );
    });

  console.log('renderPosts', renderPosts);

  return (
    <>
      <div className={style.feed} onClick={(e) => handleMenuClose(e)}>
        {posts && renderPosts}
      </div>
    </>
  );
};

export default Feed;
