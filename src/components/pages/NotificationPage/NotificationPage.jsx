import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import icon from '../../../assets/svg/icon';
import styles from './notificationPage.module.scss';
import { useHistory } from "react-router-dom";
import AllNotification from './sub/AllNotification';

const NotificationPage = () => {
  const inboxState = useSelector(state => state.inbox.inbox);

  useEffect(() => {
    setInbox(inboxState);
  }, [inboxState])

  const notificationQuantityInitial = {
    all: '',
    pending: ''
  }
  const [notificationQuantity, setNotificationQuantity] = useState(notificationQuantityInitial);
  const [inbox, setInbox] = useState([]);

  const tabList = {
    all: `All`,
    pending: `Pending action`
  }
  const [tab, setTab] = useState(tabList.all);
  const history = useHistory();
  const goToTab = (tab) => {
    setTab(tab);
  }

  const isActiveTab = (currentTab) => {
    return tab === currentTab && styles.activeTab
  }
  return (
    <>
      {<> <div className={styles.header}>
        <h4 className={styles.pageTitle}>Notification</h4>
        <img src={icon.menuGear} alt="" className={styles.iconMenuGear} />
      </div>
        <div className={styles.controlUnit}>
          <div className={styles.tabs}>
            <span className={`${styles.tabsItem} ${isActiveTab(tabList.all)}`} onClick={() => goToTab(tabList.all)}>{tabList.all} {notificationQuantity.all}</span>
            <span className={`${styles.tabsItem} ${isActiveTab(tabList.pending)}`} onClick={() => goToTab(tabList.pending)}>{tabList.pending} {notificationQuantity.pending}</span>
          </div>

        </div>

        {tab === tabList.all && < AllNotification inbox={inbox} />}

      </>}


    </>
  );
};


export default NotificationPage;
