export const ACTIONS = {
  SET_USER: 'USER::SET_USER',
  GET_USER: 'USER::GET_USER',
  // GET_USER_DATA_BY_TOKEN: 'USER::GET_USER_DATA_BY_TOKEN',
  SEND_REGISTER_DATA: 'USER::SEND_REGISTER_DATA',
  SEND_LOGIN_DATA: 'USER::SEND_LOGIN_DATA',

};

const initialStateMock = {
  // isAuth: true,
  isAuth: false,
  subscribed: [],
  wif: '',
  token: '',
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


    default:
      return state;
  }
};

export default userReducer;
