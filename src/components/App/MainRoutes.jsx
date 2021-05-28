import React from 'react';
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
// import PageNotFound from '../pages/PageNotFound/PageNotFound';
import routes from '../../config/routes.config';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import jwt from 'jsonwebtoken';
import { userActions } from '../../api/storage/user';
import format from 'date-fns/format';



const MainRouts = () => {
    const user = useSelector((state) => state.user);
    const history = useHistory();
    const dispatch = useDispatch();
    const checkAuth = () => {
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");
        const accessTokenDecoded = jwt.decode(accessToken);
        const refreshTokenDecoded = jwt.decode(refreshToken);

        // TODO: use for access token  sessionStorage
        console.log(' refreshTokenDecoded.exp', format(refreshTokenDecoded.exp * 1000, 'yyy-mm-dd[T]HH:mm'));
        if (!user.isAuth) {
            if (accessToken && refreshToken) {
                // dispatch(userActions.getPairTokens(refreshToken))
                if (accessTokenDecoded.exp * 1000 > new Date().getTime()) {
                    // dispatch(userActions.getUserByToken(accessToken));
                } else if (accessTokenDecoded.exp * 1000 < new Date().getTime()
                    && refreshTokenDecoded.exp * 1000 < new Date().getTime()) {
                    // dispatch(userActions.getPairTokens(refreshToken))
                }
            }
        }
    };


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
                                {checkAuth()}
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
