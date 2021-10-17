export const ACTIONS = {
  GET_INBOX: 'INBOX::GET_INBOX',
  SET_INBOX: 'INBOX::SET_INBOX',
  SEND_PERMISSION_DECISION: 'INBOX::SEND_PERMISSION_DECISION',
  UPDATE_INBOX_STATUS: 'INBOX::UPDATE_INBOX_STATUS',
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
    case ACTIONS.UPDATE_INBOX_STATUS:
      const updatedInbox = state.inbox.slice().map(notification => {
        if (notification.post.id === action.payload.id) {
          notification.status = action.payload.status;
        }
        return notification;
      })
      return {
        ...state,
        inbox: updatedInbox
      }
    default:
      return state;
  }
};

export default inboxReducer;
