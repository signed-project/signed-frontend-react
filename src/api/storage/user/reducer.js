export const ACTIONS = {
  GET_USER: 'USER::GET_USER',
  SET_TOKEN: 'USER::SET_TOKEN',
  LOGIN: 'USER::LOGIN',
  LOGIN_SUCCESS: 'USER::LOGIN_SUCCESS',
  LOGIN_ERROR: 'USER::LOGIN_ERROR',
  LOGOUT: 'USER::LOGOUT',
  OPEN_MODAL_403: 'USER::OPEN_MODAL_403',
};

const initialState = {
  isAuth: true,
  source: {
    address: "19FRhaywUUpvMxUMSxgpTvc44Bj9VFd3BT",
    name: "Name1",
    updatedAt: 1312321321,
    avatar: {
      contentType: "image/jpeg",
      content: {
        url: "filename.jpeg",
        hash: "f433c21fe3c6c7475f7be0017294547e93d7fcd44617f62bf7f369a13b48e764"
      },
    },
    hosts: [{
      fileStores: ['jdjjdj'],
      index: "url"
    }],
    signatures: 'fjdjd343243jkdfjdk343',
    hash: 'fjdjd343243jkdfjdk343',
  },
  subscribed: ['19FRhaywUUpvMxUMSxgpTvc44Bj9VFd3BT'],
  wfi: 'Kx7DQ8DtiTaEYut5f85jAG3bhPNJUB6neER3yQaVgueeLDT7Ax8e',
  isLoginError: false,
  isLoginProcess: false,
  token: "",
  firstName: "",
  middleName: "",
  lastName: "",
  phone: "",
  email: "",
  role: "",
  invites: [],
  modal403: false,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
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
    case ACTIONS.LOGIN:
      return {
        ...state,
        isLoginProcess: true,
      };
    case ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        isLoginProcess: false,
      };
    case ACTIONS.LOGIN_ERROR:
      return {
        ...state,
        isLoginError: true,
        isLoginProcess: false,
      };
    case ACTIONS.OPEN_MODAL_403:
      return {
        ...state,
        modal403: true,
      };
    default:
      return state;
  }
};

export default userReducer;
