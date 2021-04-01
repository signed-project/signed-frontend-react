import React, { Suspense } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Layout from '../layout/Layout';
import LayoutProvider from '../layout/LayoutProvider';
import Feed from '../pages/Feed/Feed';
import SingUp from '../pages/SingUp/SingUp';
import Search from '../pages/Search/Search';
import NewPost from '../pages/NewPost/NewPost';
import Profile from '../pages/Profile/Profile';
import SignIn from '../pages/SignIn/SignIn';
import Notification from '../pages/Notification/Notification';
import PageNotFound from '../pages/PageNotFound/PageNotFound';
import routes from '../../config/routes.config';


const MainRouts = () => {
    return (
        <>
            <LayoutProvider.Consumer >
                {({ theme, toggleTheme }) => {
                    return (
                        <Layout theme={theme}>
                            <Suspense fallback={''}>
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
                                    <Route path={routes.profile} exact
                                        component={() => <Profile theme={theme} toggleTheme={toggleTheme} />}
                                    />

                                    <Route path={routes.notification} exact
                                        component={() => <Notification theme={theme} toggleTheme={toggleTheme} />}
                                    />
                                    <Route path={routes.signUp} exact
                                        component={() => <SingUp theme={theme} toggleTheme={toggleTheme} />}
                                    />
                                </Switch>
                            </Suspense>
                        </Layout>
                    )
                }
                }
            </LayoutProvider.Consumer>

        </>
    )
}

export default MainRouts;
