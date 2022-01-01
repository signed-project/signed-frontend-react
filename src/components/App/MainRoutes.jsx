import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Layout from '../layout/Layout';
import { routeConfig } from '../../config/routes.config';

const MainRouts = () => {
    return (
        <Layout>
            <Switch>
                {routeConfig.map((route) => (
                    <Route
                        key={route.path}
                        path={route.path}
                        exact={route.exact}
                    >
                        <route.component />
                    </Route>
                ))}
            </Switch>
        </Layout>
    )
}

export default MainRouts;
