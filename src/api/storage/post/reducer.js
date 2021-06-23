export const ACTIONS = {
  SEND_POST: "POST::SEND_POST",
  UPDATE_POST: "POST::UPDATE_POST",
  ADD_POST_TO_STREAM: "POST::ADD_POST_TO_STREAM",
  ADD_POST_TO_HASH: "POST::ADD_POST_TO_HASH",
  ADD_POST_TO_LATEST: "POST::ADD_POST_TO_LATEST",
  SET_POST_STREAM: "POST::SET_POST_STREAM",
  SET_POST_HASH: "POST::SET_POST_HASH",
  SET_POST_LATEST: "POST::SET_POST_LATEST",
  GET_BOOK: "POST::GET_BOOK",
};

const initialState = {
  stream: [],
  latest: {},
  hashed: {},
};

const postReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_POST_STREAM:
      return {
        ...state,
        stream: action.payload,
      };
    case ACTIONS.SET_POST_LATEST:
      return {
        ...state,
        latest: action.payload,
      };
    case ACTIONS.SET_POST_HASH:
      return {
        ...state,
        hashed: action.payload,
      };
    case ACTIONS.ADD_POST_TO_STREAM:
      const currentStream = state.stream.filter(post => post.id !== action.payload.id)


      return {
        ...state,
        stream: [...currentStream, action.payload],
        // stream: [...state.stream, action.payload],
      };
    case ACTIONS.ADD_POST_TO_HASH:
      return {
        ...state,
        hashed: {
          ...state.hashed,
          [action.payload.hash]: action.payload,
        },
      };
    case ACTIONS.ADD_POST_TO_LATEST:
      const compositeKey =
        action.payload.source.address + "*" + action.payload.hash;
      return {
        ...state,
        latest: {
          ...state.latest,
          [compositeKey]: action.payload,
        },
      };
    default:
      return state;
  }
};

export default postReducer;
