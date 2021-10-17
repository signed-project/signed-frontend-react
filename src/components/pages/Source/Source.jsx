import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import icon from '../../../assets/svg/icon';
import styles from './source.module.scss';
import { useParams, useHistory } from "react-router-dom";
import routes from '../../../config/routes.config';
import Avatar from '../../utils/Avatar/Avatar';
import InfoAuthor from '../../utils/InfoAuthor/InfoAuthor';
import useSourcePost from "../../customHooks/useSourcePost";
import SourcePosts from './sub/SourcePosts';
import SourceInfo from './sub/SourceInfo';
import Button from "../../utils/Button/Button";
import { userApi } from '../../../config/http.config';
import { postActions } from '../../../api/storage/post';

// TODO: refactor this component to use module Post if it possible
const Source = ({ toggleTheme }) => {
    const tabList = {
        posts: 'posts',
        info: 'info'
    }

    const dispatch = useDispatch();
    let { address } = useParams();
    const [tab, setTab] = useState(tabList.posts);
    const stream = useSelector((state) => state.post.stream);
    const axios = useSelector(state => state.axios.axios);
    const user = useSelector(state => state.user);
    let source = useSourcePost(address);
    const [isAlreadyFollow, setIsAlreadyFollow] = useState(false);
    const [ownPost, setOwnPost] = useState([]);
    const history = useHistory();

    useEffect(() => {
        toggleTheme(false);
    }, [toggleTheme]);

    useEffect(() => {
        if (user.subscribed.find(sub => sub.address === address)) {
            setIsAlreadyFollow(true);
        } else {
            setIsAlreadyFollow(false);
        }
    }, [user, address]);

    useEffect(() => {
        if (Array.isArray(stream)) {
            const userPost = stream.filter(post => post.source.address === address)
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
        const action = !isAlreadyFollow;
        try {
            let { data } = await axios.post(userApi.FOLLOW_USER, {
                address: user.source.address,
                followSource: source,
                follow: action
            });
            if (data === 'Ok') {
                setIsAlreadyFollow(action);
                if (action === false) {
                    const newStream = stream.filter(post => post.source.address !== address);
                    dispatch(postActions.updatePostStream(newStream));
                }
            }
        }
        catch (e) {
            console.warn('[Source][followHandler]', e)
        }
    }

    return (
        <>
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
                        <Button className={`follow ${isAlreadyFollow ? 'clean' : 'primary'} `} onClick={() => followHandler()}>
                            {isAlreadyFollow ? 'Following' : 'Follow'}
                        </Button>
                    </div>
                </div>

            </>
            }
            {tab === tabList.posts && < SourcePosts ownPost={ownPost} />}
            {tab === tabList.info && <SourceInfo source={source} />}
        </>
    );
};

export default Source;
