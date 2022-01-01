import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory, useParams, useLocation } from "react-router-dom";
import queryString from "query-string";
import styles from "./tagPage.module.scss";
import Post from "../../utils/Post/Post";
import { routes } from "../../../config/routes.config";
import icon from "../../../assets/svg/icon";
import useSourcePost from "../../customHooks/useSourcePost.js";
import { LayoutContext } from "../../layout/LayoutProvider";

const TagPage = () => {
  const layoutContext = useContext(LayoutContext);

  const axios = useSelector((state) => state.axios.axios);

  let history = useHistory();
  const location = useLocation();

  const { tagApi } = queryString.parse(location.search);
  let { address, tag } = useParams();
  const source = useSourcePost(address);

  console.log("address777", address);
  console.log("tag9999", tag);

  const handleShowMenu = (hash) => {
    setOpenMenuHash(hash);
  };

  const [tagPostArr, setTagPostArr] = useState([]);
  const [openMenuHash, setOpenMenuHash] = useState(null);

  useEffect(() => {
    layoutContext.toggleTheme(false);
  }, [layoutContext]);

  //    try {
  //     if (source && source.hosts[0].tag) {
  //         const { data } = await axios.get(`${source.hosts[0].tag}/${tag}`);
  //         if (data && Array.isArray(data)) {
  //           setTagPostArr(data);
  //         }
  //       }
  //     } catch (e) {
  //       console.warn("[TapPage][useEffect][tagApi]");
  //     }

  useEffect(() => {
    (async () => {
      try {
        if (Array.isArray(source.hosts)) {
          const { data } = await Promise.any(
            source.hosts.map(async (host) => {
              return await axios.get(`${host.tag}/${tag}`);
            })
          );
          setTagPostArr(data);
        }
      } catch (e) {
        console.warn("[TapPage][useEffect][tagApi]");
      }
    })();
  }, [source, axios, tag]);

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

  const handleEditPost = (hash, id) => {
    history.push(`${routes.newPost}?edit=${hash}`);
  };

  const renderPosts = tagPostArr.slice().map((p, i) => {
    return (
      <Post
        post={p}
        avatar={p.source.avatar}
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

  return source ? (
    <>
      <div div className={styles.backBlock}>
        <img
          src={icon.arrowBack}
          onClick={history.goBack}
          alt="arrow back icon"
        />
      </div>
      <div className={styles.bodyBlock}>
        {tagPostArr.length > 0 && renderPosts}
      </div>
    </>
  ) : (
    ""
  );
};

export default TagPage;
