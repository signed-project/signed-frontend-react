import axios from "axios";

export const ACTIONS = {
  SET_TOKEN: "AXIOS::SET_TOKEN",
};

const API_HOST = process.env.REACT_APP_API_HOST;

const initialState = {
  axios: axios.create({
    baseURL: API_HOST,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      // Authorization: "Bearer " + 'token',
      // 'Accept': 'application/json',
    },
  }),
};


const generateAxiosInstance = (token) => {
  const instance = axios.create({
    baseURL: API_HOST,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: "Bearer " + token,
    }
  });
  return instance;
};

const axiosReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_TOKEN:
      return {
        ...state,
        axios: generateAxiosInstance(action.payload),
      };
    default:
      return state;
  }
};

export default axiosReducer;
