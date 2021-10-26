import axios from "axios";
import { hostApi } from '../../../config/http.config';
export const ACTIONS = {
  SET_TOKEN: "AXIOS::SET_TOKEN",
};

const API_HOST = hostApi.API_HOST;

const initialState = {
  axios: axios.create({
    baseURL: API_HOST,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }),
};

// 'Accept': 'application/json',

const generatePrivateAxiosInstance = ({ token }) => {
  const instance = axios.create({
    baseURL: API_HOST,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${token}`,
    }
  });
  return instance;
};

const axiosReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_TOKEN:
      return {
        ...state,
        axios: generatePrivateAxiosInstance({ token: action.payload }),
      };
    default:
      return state;
  }
};

export default axiosReducer;
