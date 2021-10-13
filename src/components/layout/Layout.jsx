import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import Header from './Header/Header';
import Navigation from './Navigation/Navigation';
import WelcomeSing from './WelcomeSign/WelcomeSign';
import router from '../../config/routes.config';
import styles from './layout.module.scss';
import { inboxActions } from '../../api/storage/inbox';
import { sourceActions } from '../../api/storage/source';
import { postActions } from '../../api/storage/post';
import { userApi } from '../../config/http.config.js';
const apiHost = process.env.REACT_APP_API_HOST;


const Layout = ({ children, theme }) => {
  const [isAuthPage, setISAuthPage] = useState(false)
  const { isAuth } = useSelector(state => state.user);
  const location = useLocation();
  const dispatch = useDispatch();


  const getSubscribedIndex = async ({ subscribed }) => {
    console.log('getSubscribedIndex[subscribed.length]', subscribed.length);

    let gatheredPosts = [],
      hostSources = [];


    try {
      await Promise.allSettled(
        subscribed.map(async (sbs) => {
          await Promise.allSettled(
            sbs.hosts.map(async (hst) => {
              let res = await axios.get(`${hst.index}`);
              if (res?.data?.index?.recentPosts) {
                // gatheredPosts.push(...indexPosts);
                const indexPosts = res?.data?.index?.recentPosts;

                console.log('res?.data?.index?.recentPosts[indexPosts]', indexPosts);
                console.log('Array.isArray(indexPosts) && indexPosts.length > 0', Array.isArray(indexPosts) && indexPosts.length > 0);
                if (Array.isArray(indexPosts) && indexPosts.length > 0)
                  dispatch(postActions.addTempPost(indexPosts));
              }
              if (res?.data?.source) {
                // hostSources.push(res?.data?.source);
                dispatch(sourceActions.addTempSourceItem(res?.data?.source));
              }
              return;
            })
          );
        })
      );

    } catch (e) {
      console.warn("[getSubscribedIndex][Promise.all]", e);
    }

    console.log('gatheredPosts', gatheredPosts.length);
    console.log('hostSources', hostSources.length);
    return { gatheredPosts, hostSources };
  };


  const getAllHostsIndex = async () => {
    let data;
    try {
      ({ data } = await axios.get(`${apiHost}${userApi.SUBSCRIBED}`));
      console.log('[getAllHostsIndex][]data', data.length);
    } catch (e) {
      console.warn("[getIndexSaga][getAllHostsIndex]", e);
    }

    try {
      const { gatheredPosts, hostSources } = await getSubscribedIndex({
        subscribed: data,
      });
      // return { gatheredPosts, hostSources };
    } catch (e) {
      console.warn("[getIndexSaga][getAllHostsIndex][getSubscribedIndex]", e);
      return [];
    }
  };


  useEffect(() => {
    if (isAuth) {
      dispatch(inboxActions.getInbox());
    }
  }, [isAuth]);

  useEffect(() => {
    if (!isAuth) {

      (async () => {
        await getAllHostsIndex()
      })()


    }
  }, []);

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
