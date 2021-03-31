import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Layout from '../layout/Layout';

import Feed from '../pages/Feed/Feed';
import SingUp from '../pages/SingUp/SingUp';
// import Search from '../pages/SignIn/SignIn';
// import NewPost from '../pages/SignIn/SignIn';
// import Profile from '../pages/SignIn/SignIn';
// import SignIn from '../pages/SignIn/SignIn';
// import Notification from '../pages/SignIn/SignIn';
import PageNotFound from '../pages/PageNotFound/PageNotFound';
import routes from '../../config/routes.config'
// import MainRouts from './MainRoutes';

const App = () => {

  const isAuth = useSelector(state => state.user.isAuth)
  console.log('is', isAuth);

  const checkAuth = () => {
    if (isAuth) {
      return (
        <Switch>
          <Layout>
            <Route path={routes.feed} exact component={Feed} />
            {/*   <Route path={signInConfig.path} component={Search} />
            <Route path={signInConfig.path} component={NewPost} />
            <Route path={signInConfig.path} component={Profile} />
            <Route path={signInConfig.path} component={Notification} /> */}
            {/* <Route component={PageNotFound} /> */}
          </Layout>
        </Switch>
      )
    }
    else {
      return (
        <Switch>
          <Redirect to={routes.signUp} />
          {/* <Route path={routes.signUp} exact component={SingUp} /> */}
        </Switch>
      )
    }
  }

  return (
    <BrowserRouter basename={'/'}>
      {/* <ErrorBoundary onError={() => setAppError(true)}> */}
      {checkAuth()}


      {!isAuth &&
        <>
          < Switch >
            <Route path={routes.signUp} exact component={SingUp} />
          </Switch>
        </>
      }
      {/* </ErrorBoundary> */}
    </BrowserRouter >
  );
};

export default App;
