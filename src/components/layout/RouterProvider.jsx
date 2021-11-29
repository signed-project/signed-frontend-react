import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";

export const RouterContext = React.createContext();

const RouterProvider = ({children}) => {
  const location = useLocation();
  
  const [stateRouter, setStateRouter] = useState({});
  const [route, setRoute] = useState({
    to: location.pathname,
    from: location.pathname
  });

  const [sharingState, setSharingState] = useState({
    route,
    stateRouter,
  });

  useEffect(() => {
    setRoute((prevRoute) => {
      return {
        to: location.pathname, 
        from: prevRoute.to
      };
    });
    setStateRouter((prevState) => ({
      ...prevState,
      ...location.state,
    }));
  }, [location]);

  useEffect(() => {
    setSharingState((prevState) => ({
      ...prevState,
      route,
      stateRouter,
    }))
  }, [route, stateRouter]);
  
  return <RouterContext.Provider value={sharingState}>
    {children}
  </RouterContext.Provider>
};

export default RouterProvider;