import React, { useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import Header from "./Header/Header";
import Navigation from "./Navigation/Navigation";
import WelcomeSing from "./WelcomeSign/WelcomeSign";
import { routes as router } from "../../config/routes.config";
import styles from "./layout.module.scss";
// import { getDefaultSources, getSourcesIndex } from '../../api/customNpmPackage/loadIndexes';
import { inboxActions } from "../../api/storage/inbox";
import { sourceActions } from "../../api/storage/source";
import { postActions } from "../../api/storage/post";
import { userApi, hostApi } from "../../config/http.config.js";
import { getStreamPage } from "./../../api/customNpmPackage/signedLoader";
import axios from "axios";

import { LayoutContext } from "./LayoutProvider";

const apiHost = hostApi.API_HOST;

const Layout = ({ children }) => {
  const layoutContext = useContext(LayoutContext);

  const [isAuthPage, setISAuthPage] = useState(false);
  const {
    isAuth,
    subscribed,
    source: userSource,
  } = useSelector((state) => state.user);
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuth) {
      dispatch(inboxActions.getInbox());
    }
  }, [isAuth]);

  const updateStream = ({ stream }) => {
    dispatch(postActions.updatePostStream(stream));
  };

  const updateNumberOfLoadedPosts = ({ lengthOfInternalRootPosts, lengthOfUserRootPosts }) => {
    dispatch(postActions.setAlreadyLoadedPosts(lengthOfUserRootPosts));
    dispatch(postActions.setLoadedPosts(lengthOfInternalRootPosts));
  }

  useEffect(() => {
    if (!isAuth) {
      (async () => {
        try {
          const { data } = await axios.get(`${apiHost}${userApi.SUBSCRIBED}`);

          dispatch(sourceActions.setSubscribedSources(data));

          getStreamPage({
            postsSource: "",
            subscribedSources: data,
            blacklistedSourcesByAddress: {},
            afterPost: {},
            endPost: {},
            limit: 10,
            callbackForUpdateStream: updateStream,
            callbackForUpdatePostsNumber: updateNumberOfLoadedPosts,
          });
        } catch (e) {
          console.warn("[Layout][useEffect-52-line]", e);
        }
      })();
    } else {
      getStreamPage({
        postsSource: "",
        subscribedSources: [...subscribed, userSource],
        blacklistedSourcesByAddress: {},
        afterPost: {},
        endPost: {},
        limit: 10,
        callbackForUpdateStream: updateStream,
        callbackForUpdatePostsNumber: updateNumberOfLoadedPosts,
      });
    }
  }, [isAuth]);

  useEffect(() => {
    setISAuthPage(false);
  }, [location]);

  useEffect(() => {
    if (
      location &&
      (location.pathname === router.register ||
        location.pathname === router.login)
    ) {
      setISAuthPage(true);
    }
  }, [location]);

  // style={{ height: '100%' }}
  return (
    <div className={styles.app}>
      {layoutContext.theme && <Header title="signed.移动" />}
      <main>{children}</main>
      {layoutContext.theme && isAuth && <Navigation />}
      {!isAuth && !isAuthPage && <WelcomeSing />}
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node,
};

export default Layout;
