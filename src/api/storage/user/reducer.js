export const ACTIONS = {
  SET_USER: 'USER::SET_USER',
  GET_USER: 'USER::GET_USER',
  // GET_USER_DATA_BY_TOKEN: 'USER::GET_USER_DATA_BY_TOKEN',
  SEND_REGISTER_DATA: 'USER::SEND_REGISTER_DATA',
  SEND_LOGIN_DATA: 'USER::SEND_LOGIN_DATA',
  SET_LOGIN_ERROR: 'USER::SET_LOGIN_ERROR',
  SET_LOADING: 'USER::SET_LOADING',
};

const initialStateMock = {
  // isAuth: true,
  isAuth: false,
  subscribed: [],
  wif: '',
  token: '',
  loginError: '',
  source: {
    address: "19FRhaywUUpvMxUMSxgpTvc44Bj9VFd3BT",
    name: "Name1",
    updatedAt: 1312321321,
    avatar: {
      contentType: "image/jpeg",
      hash: "f433c21fe3c6c7475f7be0017294547e93d7fcd44617f62bf7f369a13b48e764"
    },
    hosts: [{
      fileStores: ['jdjjdj'],
      index: "url"
    }],
    signatures: 'fjdjd343243jkdfjdk343',
    hash: 'fjdjd343243jkdfjdk343',
  },

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
