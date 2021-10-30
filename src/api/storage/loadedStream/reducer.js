export const ACTIONS = {
  SET_LOADED_STREAM: "LOADED_STREAM::SET_LOADED_STREAM",
};

const initialState = {
  archives: [],
  recentPosts: {
    startDate: 0,
    endDate: 0,
    posts: [],
  },
};

export const loadedStreamReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADED_STREAM: {
      return {
        ...action.payload,
      };
    }
    default: {
      return state;
    }
  }
};
