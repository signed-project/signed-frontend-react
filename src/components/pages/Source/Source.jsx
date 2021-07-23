import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import queryString from "query-string";
import icon from '../../../assets/svg/icon';
import styles from './source.module.scss';
import { useLocation, useParams, useHistory } from "react-router-dom";
import routes from '../../../config/routes.config';
import Avatar from '../../utils/Avatar/Avatar';
import InfoAuthor from '../../utils/InfoAuthor/InfoAuthor';
import useSourcePost from "../../customHooks/useSourcePost";

// TODO: refactor this component to use module Post if it possible
const Source = ({ toggleTheme }) => {


    const tabList = {
        posts: 'posts',
        info: 'info'
    }

    let { address } = useParams();
    const [tab, setTab] = useState(tabList.posts);
    const stream = useSelector((state) => state.post.stream);
    let sourcePost = useSourcePost(address);
    const [source, setSource] = useState('');
    const [ownPost, setOwnPost] = useState([]);
    const history = useHistory();




    useEffect(() => {
        toggleTheme(false);
    }, [toggleTheme]);

    useEffect(() => {
        if (Array.isArray(stream)) {
            const userPost = stream.filter(post => post.source.address === source.address)
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
            {/*  <div div className={styles.backBlock} >
                <img src={icon.arrowBack} onClick={() => history.push(routes.feed)} alt="arrow back icon" />
            </div> */}
            <div className={styles.header}>
                <img src={icon.arrowBack} onClick={() => history.push(routes.feed)} alt="arrow back icon" />
                <Avatar avatar={sourcePost.avatar} address={address} />
                <InfoAuthor name={sourcePost.name} address={address} />
            </div>
            <div className={styles.tabs}>
                <span className={`${styles.tabsItem} ${isActiveTab(tabList.posts)}`} onClick={() => goToTab(tabList.posts)}>Posts</span>
                <span className={`${styles.tabsItem} ${isActiveTab(tabList.info)}`} onClick={() => goToTab(tabList.info)}>Info</span>
                <span className={styles.tabsItem}>Users</span>
            </div>
            {/* {tab === tabList.posts && < ProfilePosts ownPost={ownPost} />}
            {tab === tabList.info && <ProfileInfo />} */}



        </>
    );
};

export default Source;
