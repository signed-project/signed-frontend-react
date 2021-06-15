export const ACTIONS = {
  SET_USER: 'USER::SET_USER',
  GET_USER: 'USER::GET_USER',
  GET_USER_DATA_BY_TOKEN: 'USER::GET_USER_DATA_BY_TOKEN',
  SEND_REGISTER_DATA: 'USER::SEND_REGISTER_DATA',
  SEND_LOGIN_DATA: 'USER::SEND_LOGIN_DATA',
};


const initialState = {
  isAuth: true,
  // isAuth: false,
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
  subscribed: ['19FRhaywUUpvMxUMSxgpTvc44Bj9VFd3BT'],
  wif: 'Kx7DQ8DtiTaEYut5f85jAG3bhPNJUB6neER3yQaVgueeLDT7Ax8e',
  token: 'fjkajslfdas434jk234j2k4j23l4j2l34j2l3'
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_USER:
      console.log('action.payload&&&&&&&&&&&&&&&&&', action.payload);
      return {
        ...action.payload
      };
    case ACTIONS.GET_USER:
      return {
        ...state,
        USER: action.payload
      };
    case ACTIONS.LOGOUT:
      return {
        ...initialState,
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
