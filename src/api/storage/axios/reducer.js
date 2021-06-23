import axios from "axios";



const API_HOST = process.env.REACT_APP_API_HOST;

const initialState = {
  axios: axios.create({
    baseURL: API_HOST,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      // 'Accept': 'application/json',
    },
  }),
};


const generateAxiosInstance = (token) => {
  // const { dispatch } = store;
  const instance = axios.create({
    baseURL: API_HOST,
  });
  return instance;
};

const axiosReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'actions.SET_TOKEN':
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
