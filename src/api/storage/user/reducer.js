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
