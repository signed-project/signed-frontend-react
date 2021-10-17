export const ACTIONS = {
  SET_USER: 'USER::SET_USER',
  GET_USER: 'USER::GET_USER',
  UPDATE_USER: 'USER::UPDATE_USER',
  SEND_REGISTER_DATA: 'USER::SEND_REGISTER_DATA',
  SEND_LOGIN_DATA: 'USER::SEND_LOGIN_DATA',
  SET_LOGIN_ERROR: 'USER::SET_LOGIN_ERROR',
  SET_LOADING: 'USER::SET_LOADING',
};

const initialState = {
  // isAuth: true,
  isAuth: false,
  subscribed: [],
  wif: '',
  token: '',
  loginError: '',
  isLoginProcess: false,
  test: '',
  source: {},
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_USER:
      return {
        ...action.payload
      };
    case ACTIONS.SET_TOKEN:
      return {
        ...state,
        token: action.token,
        isAuth: true,
      };
    case ACTIONS.SET_LOGIN_ERROR:
      return {
        ...state,
        loginError: action.payload
      };
    case ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoginProcess: action.payload
      };
    default:
      return state;
  }
};

export default userReducer;
