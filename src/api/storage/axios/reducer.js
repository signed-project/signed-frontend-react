import axios from "axios";
// import { store } from "../../index";


const API_HOST = process.env.REACT_APP_API_HOST;

const initialState = {
  axios: axios.create({
    baseURL: API_HOST,
    headers: {},
  }),
};

const generateAxiosInstance = (token) => {
  // const { dispatch } = store;
  const instance = axios.create({
    baseURL: API_HOST,
    headers: {
      "Content-Type": "application/json",
      // Authorization: "Bearer " + token,
    },
  });

  return instance;
};

const axiosReducer = (state = initialState, action) => {
  switch (action.type) {
    case ' actions.SET_TOKEN':
      return {
        ...state,
        axios: generateAxiosInstance(),
        // axios: generateAxiosInstance(action.token),
      };
    case "set":
      return {
        ...state,
        axios: "",
      };

    default:
      return state;
  }
};

export default axiosReducer;
