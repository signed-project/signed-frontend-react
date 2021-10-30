export const ACTIONS = {
  SET_CURRENT_STREAM: "CURRENT_STREAM::SET_CURRENT_STREAM",
};

const initialState = {
  currentTime: "",
};

export const currentStreamReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_CURRENT_STREAM: {
      return {
        ...state,
        posts: action.payload,
      };
    }
    default: {
      return state;
    }
  }
};
