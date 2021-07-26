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
import SourcePosts from './sub/SourcePosts';
import SourceInfo from './sub/SourceInfo';
import Button from "../../utils/Button/Button";
import { userApi } from '../../../config/http.config';

// TODO: refactor this component to use module Post if it possible
const Source = ({ toggleTheme }) => {


    const tabList = {
        posts: 'posts',
        info: 'info'
    }

    let { address } = useParams();
    const [tab, setTab] = useState(tabList.posts);
    const stream = useSelector((state) => state.post.stream);
    const axios = useSelector(state => state.axios.axios);
    const user = useSelector(state => state.user);
    let source = useSourcePost(address);
    const [isFollowing, setIsFollowing] = useState(false);
    const [ownPost, setOwnPost] = useState([]);
    const history = useHistory();

    useEffect(() => {
        toggleTheme(false);
    }, [toggleTheme]);

    useEffect(() => {
        if (Array.isArray(stream)) {
            console.log('stream', stream);
            const userPost = stream.filter(post => post.source.address === address)
            console.log('userPost', userPost);
            setOwnPost(userPost);
        }
    }, [stream]);

    const goToTab = (tab) => {
        setTab(tab);
    }

    const isActiveTab = (currentTab) => {
        return tab === currentTab && styles.activeTab
    }

    const followHandler = async () => {
        const action = isFollowing;
        try {
            let { data } = await axios.post(userApi.FOLLOW_USER, {
                current: user.source.address,
                toFollow: source,
                action: true
            });

        }
        catch (e) {
            console.warn('[Source][followHandler]', e)
        }

    }

    return (
        <>
            {/*  <div div className={styles.backBlock} >
                <img src={icon.arrowBack} onClick={() => history.push(routes.feed)} alt="arrow back icon" />
            </div> */}
            {source && <> <div className={styles.header}>
                <img src={icon.arrowBack} onClick={() => history.push(routes.feed)} alt="arrow back icon" className={styles.iconBack} />
                <Avatar avatar={source.avatar} address={address} />
                <InfoAuthor name={source.publicName} address={address} />
            </div>
                <div className={styles.controlUnit}>
                    <div className={styles.tabs}>
                        <span className={`${styles.tabsItem} ${isActiveTab(tabList.posts)}`} onClick={() => goToTab(tabList.posts)}>Posts</span>
                        <span className={`${styles.tabsItem} ${isActiveTab(tabList.info)}`} onClick={() => goToTab(tabList.info)}>Info</span>
                    </div>
                    <div className={styles.buttonWrapper}>
                        <Button className="primary follow" onClick={() => followHandler()}>Follow</Button>
                    </div>
                    {/* Following */}
                </div>

            </>
            }
            {tab === tabList.posts && < SourcePosts ownPost={ownPost} />}
            {tab === tabList.info && <SourceInfo source={source} />}
        </>
    );
};

export default Source;
