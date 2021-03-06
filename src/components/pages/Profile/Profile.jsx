import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styles from './profile.module.scss';
import icon from '../../../assets/svg/icon';
import ProfilePosts from './sub/ProfilePosts';
import ProfileInfo from './sub/ProfileInfo';
import { LayoutContext } from '../../layout/LayoutProvider';

const Profile = () => {
  const layoutContext = useContext(LayoutContext);

  console.log("|_____------------------ PROFILE PAGE!");
  useEffect(() => {
    layoutContext.toggleTheme(true);
  }, [layoutContext]);

  const tabList = {
    posts: 'posts',
    info: 'info'
  }
  const [ownPost, setOwnPost] = useState([]);
  const [tab, setTab] = useState(tabList.posts);
  const stream = useSelector((state) => state.post.stream);
  const source = useSelector((state) => state.user.source);

  useEffect(() => {
    if (Array.isArray(stream)) {
      const userPost = stream.filter(post => post.rootPost.source.address === source.address)
      console.log("userPost---userPost");
      console.dir(userPost);
      setOwnPost(userPost);
    }
  }, [stream]);


  const goToTab = (tab) => {
    setTab(tab);
  }

  const isActiveTab = (currentTab) => {
    return tab === currentTab && styles.activeTab
  }

  return (
    <>
      <div className={styles.header}>
        <h4 className={styles.pageTitle}>Profile</h4>
        <img src={icon.menuGear} alt="" className={styles.iconMenuGear} />
      </div>
      <div className={styles.tabs}>
        <span className={`${styles.tabsItem} ${isActiveTab(tabList.posts)}`} onClick={() => goToTab(tabList.posts)}>Posts</span>
        <span className={`${styles.tabsItem} ${isActiveTab(tabList.info)}`} onClick={() => goToTab(tabList.info)}>Info</span>
        <span className={styles.tabsItem}>Users</span>
      </div>
      {tab === tabList.posts && <ProfilePosts ownPost={ownPost} />}
      {tab === tabList.info && <ProfileInfo />}
    </>
  );
};

export default Profile;
