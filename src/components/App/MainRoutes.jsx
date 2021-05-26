import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import Layout from '../layout/Layout';
import LayoutProvider from '../layout/LayoutProvider';
import Feed from '../pages/Feed/Feed';
import SingUp from '../pages/Register/Register';
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
import { userAction } from '../../api/storage/user';

const MainRouts = () => {
    const user = useSelector((state) => state.user);

    const checkAuth = () => {
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");
        const accessTokenDecoded = jwt.decode(accessToken);
        const refreshTokenDecoded = jwt.decode(refreshToken);
        console.log('accessTokenDecoded', accessTokenDecoded);
        if (!user.isAuth) {
            if (accessToken && refreshToken) {
                if (accessTokenDecoded.exp * 1000 < new Date().getTime()) {
                    if (refreshTokenDecoded.exp < new Date().getTime() / 1000) {
                        //     direct to sign up 
                    }
                    else {
                        // get new token and get user
                    }
                }
                // send to get user data from server without get new token
            }
            else {
                // sing up/in
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
