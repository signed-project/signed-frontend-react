import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import Layout from '../layout/Layout';
import LayoutProvider from '../layout/LayoutProvider';
import Feed from '../pages/Feed/Feed';
import Search from '../pages/Search/Search';
import NewPost from '../pages/NewPost/NewPost';
import PostPage from '../pages/PostPage/PostPage';
import Profile from '../pages/Profile/Profile';
import NotificationPage from '../pages/NotificationPage/NotificationPage';
import routes from '../../config/routes.config';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import Source from '../pages/Source/Source';
import { postActions } from '../../api/storage/post';
import TagPage from '../pages/TagPage/TagPage';

const MainRouts = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(postActions.getIndex({ isRegistered: false }));
        // dispatch(inboxActions.getInbox());
    }, []);

    return (
        <>
            <LayoutProvider.Consumer >
                {({ theme, toggleTheme }) => {
                    return (
                        <Layout theme={theme}>
                            <Switch>
                                <Route path={routes.feed} exact
                                    component={() => <Feed theme={theme} toggleTheme={toggleTheme} />}
                                />
                                <Route path={routes.search} exact
                                    component={() => <Search theme={theme} toggleTheme={toggleTheme} />}
                                />
                                <Route path={routes.newPost} exact
                                    component={() => <NewPost theme={theme} toggleTheme={toggleTheme} />}
                                />
                                <Route path={routes.postHash}
                                    component={() => <PostPage theme={theme} toggleTheme={toggleTheme} />}
                                />
                                <Route path={routes.sourceAddress}
                                    component={() => <Source theme={theme} toggleTheme={toggleTheme} />}
                                />
                                <Route path={routes.profile} exact
                                    component={() => <Profile theme={theme} toggleTheme={toggleTheme} />}
                                />
                                <Route path={routes.tagTagName} exact
                                    component={() => <TagPage theme={theme} toggleTheme={toggleTheme} />}
                                />
                                <Route path={routes.notification} exact
                                    component={() => <NotificationPage theme={theme} toggleTheme={toggleTheme} />}
                                />
                                <Route path={routes.login} exact
                                    component={() => <Login theme={theme} toggleTheme={toggleTheme} />}
                                />
                                <Route path={routes.register} exact
                                    component={() => <Register theme={theme} toggleTheme={toggleTheme} />} />

                            </Switch>
                        </Layout>
                    )
                }
                }
            </LayoutProvider.Consumer>
        </>
    )
}

export default MainRouts;
