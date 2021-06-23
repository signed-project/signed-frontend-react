import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, useHistory } from 'react-router-dom';
import Layout from '../layout/Layout';
import LayoutProvider from '../layout/LayoutProvider';
import Feed from '../pages/Feed/Feed';
import Search from '../pages/Search/Search';
import NewPost from '../pages/NewPost/NewPost';
import PostPage from '../pages/PostPage/PostPage';
import Profile from '../pages/Profile/Profile';
import Notification from '../pages/Notification/Notification';
import routes from '../../config/routes.config';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import jwt from 'jsonwebtoken';
import { userActions } from '../../api/storage/user';
import { postActions } from '../../api/storage/post';


const MainRouts = () => {
    const user = useSelector((state) => state.user);
    const history = useHistory();
    const dispatch = useDispatch();

    const checkAuth = () => {
        const accessToken = sessionStorage.getItem("accessToken");
        const wif = sessionStorage.getItem("wif");
        const accessTokenDecoded = jwt.decode(accessToken);

        // if (user.isAuth === false && wif && accessToken && accessTokenDecoded.exp * 1000 > new Date().getTime()) {
        if (wif && accessToken && accessTokenDecoded.exp * 1000 > new Date().getTime()) {
            const payload = {
                wif, accessToken
            }

            console.log('111111111111111111111111111111111111111111');
            dispatch(userActions.getUser(payload));
            // dispatch(postActions.getBook({ isRegistered: false }));
        }
        else {
            console.log('2222222222222222222222222222222');

            dispatch(postActions.getBook({ isRegistered: false }));
        }
    };

    useEffect(() => {
        checkAuth();
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
                                <Route path={routes.profile} exact
                                    component={() => <Profile theme={theme} toggleTheme={toggleTheme} />}
                                />
                                <Route path={routes.notification} exact
                                    component={() => <Notification theme={theme} toggleTheme={toggleTheme} />}
                                />
                                <Route path={routes.login} exact
                                    component={() => <Login theme={theme} toggleTheme={toggleTheme} />} />
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
