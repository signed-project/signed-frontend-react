export const ACTIONS = {
  GET_INBOX: 'INBOX::GET_INBOX',
  SET_INBOX: 'INBOX::SET_INBOX',
  SEND_PERMISSION_DECISION: 'INBOX::SEND_PERMISSION_DECISION',
  SET_PERMISSION: 'INBOX::SET_PERMISSION',
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
    case ACTIONS.SET_PERMISSION:
      return {
        ...state,
        // inbox: action.payload
      }
    default:
      return state;
  }
};

export default inboxReducer;
