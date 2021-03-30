import React, { useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Layout from '../layout/Layout';
import { ErrorBoundary } from '../utils';

import Home, { config as homeConfig } from '../pages/Home/Home';
import SignIn, { config as signInConfig } from '../pages/SignIn/SignIn';
import PageNotFound from '../pages/PageNotFound/PageNotFound';

const App = () => {
  const [appError, setAppError] = useState(false);

  return (
    <BrowserRouter basename={'/'}>
      <ErrorBoundary onError={() => setAppError(true)}>
        <Switch>
          <Layout>
            <Switch>
              <Route path={homeConfig.path} exact component={Home} />
              <Route path={signInConfig.path} component={SignIn} />

              <Route component={PageNotFound} />
            </Switch>
          </Layout>
          {/* <Notifications /> if would be created */}
        </Switch>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default App;
