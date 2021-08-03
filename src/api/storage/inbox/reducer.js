export const ACTIONS = {
  GET_INBOX: 'INBOX::GET_INBOX',
  SET_INBOX: 'INBOX::SET_INBOX',
};

const initialState = {
  inbox: []
};

const inboxReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_INBOX:
      return {
        ...state,
        inbox: action.payload
      }
    default:
      return state;
  }
};

export default inboxReducer;
