import React from 'react';

import withAuthorization from '../../../hoc/withAuthorization';
import routeConfig from '../../../config/routes.config';

export const config = { path: routeConfig.signIn.path };

const SignIn = (props) => {
  return <div className="">SignIn</div>;
};

export default withAuthorization(false)(SignIn);
