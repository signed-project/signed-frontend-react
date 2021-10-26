import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import Header from './Header/Header';
import Navigation from './Navigation/Navigation';
import WelcomeSing from './WelcomeSign/WelcomeSign';
import router from '../../config/routes.config';
import styles from './layout.module.scss';
import { getDefaultSources, getSourcesIndex } from '../../api/customNpmPackage/loadIndexes';
import { inboxActions } from '../../api/storage/inbox';
import { sourceActions } from '../../api/storage/source';
import { postActions } from '../../api/storage/post';
import { userApi, hostApi } from '../../config/http.config.js';
 
const apiHost = hostApi.API_HOST;

const Layout = ({ children, theme }) => {
  const [isAuthPage, setISAuthPage] = useState(false)
  const { isAuth, subscribed, source: userSource } = useSelector(state => state.user);
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuth) {
      dispatch(inboxActions.getInbox());
    }
  }, [isAuth]);

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

  useEffect(() => {
    if (!isAuth) {
      (async () => {
        await getDefaultSources({
          dispatch, setAllReceivedSourcesNumber, setCurrentAlreadySetSourcesNumber,
          addTempPostArr, setAddTempSourceItem, getSubscribedPath: `${apiHost}${userApi.SUBSCRIBED}`
        })
      })()
    }
    else {
      (async () => {
        await getSourcesIndex({
          sources: [...subscribed, userSource], setAllReceivedSourcesNumber,
          setCurrentAlreadySetSourcesNumber, addTempPostArr, setAddTempSourceItem,
        })
      })()
    }
  }, [isAuth]);

  useEffect(() => {
    setISAuthPage(false)
  }, [location]);

  useEffect(() => {
    if (location && (location.pathname === router.register || location.pathname === router.login)) {
      setISAuthPage(true)
    }
  }, [location])

  // style={{ height: '100%' }}
  return (
    <div className={styles.app}>
      {theme && <Header title='signed.移动' />}
      <main >
        {children}
      </main>
      {theme && isAuth && <Navigation />}
      {!isAuth && !isAuthPage && < WelcomeSing />}
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node,
};

export default Layout;
