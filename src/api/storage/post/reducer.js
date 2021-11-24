export const ACTIONS = {
  SEND_POST: "POST::SEND_POST",
  UPDATE_POST: "POST::UPDATE_POST",
  ADD_POST_TO_STREAM: "POST::ADD_POST_TO_STREAM",
  ADD_POST_TO_HASH: "POST::ADD_POST_TO_HASH",
  ADD_POST_TO_LATEST: "POST::ADD_POST_TO_LATEST",
  SET_POST_STREAM: "POST::SET_POST_STREAM",
  UPDATE_POST_STREAM: "POST::UPDATE_POST_STREAM",
  SET_POST_HASH: "POST::SET_POST_HASH",
  SET_POST_LATEST: "POST::SET_POST_LATEST",
  SET_HASHED_TARGET_POST: "POST::SET_HASHED_TARGET_POST",
  ADD_HASHED_TARGET_POST: "POST::ADD_HASHED_TARGET_POST",
  GET_INDEX: "POST::GET_INDEX",
  ADD_TEMP_POST_ITEM: "POST::ADD_TEMP_POST_ITEM",
  SET_ALREADY_LOADED_POSTS: "POST::SET_ALREADY_LOADED_POSTS",
  SET_LOADED_POSTS: "POST::SET_LOADED_POSTS",
};

const initialState = {
  stream: [],
  latest: {},
  hashed: {},
  hashedTargetPost: {},
  temp: [],
  alreadyLoadedPosts: 0,
  loadedPosts: 0,
};

const postReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_ALREADY_LOADED_POSTS:
      return {
        ...state,
        alreadyLoadedPosts: action.payload,
      };
    case ACTIONS.SET_LOADED_POSTS:
      return {
        ...state,
        loadedPosts: action.payload,
      };
    case ACTIONS.SET_POST_STREAM:
      return {
        ...state,
        stream: action.payload,
      };
    case ACTIONS.UPDATE_POST_STREAM:
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
    case ACTIONS.SET_HASHED_TARGET_POST:
      return {
        ...state,
        hashedTargetPost: action.payload,
      };
    case ACTIONS.ADD_HASHED_TARGET_POST:
      // TODO: Think about reply on reply, how to better organize it
      console.log("action.payload");
      console.dir(action.payload);

      const stateHashedTargetPost = { ...state.hashedTargetPost };
      const currHashPost = action.payload.target.postHash;

      console.log("currHashPost");
      console.dir(currHashPost);

      console.log(" ---- before-add ---- stateHashedTargetPost");
      console.dir(stateHashedTargetPost);

      const currHashedTargetPost = stateHashedTargetPost[currHashPost];

      console.log(" ----------------- currHashedTargetPost -----------------");
      console.dir(currHashedTargetPost);

      if (currHashedTargetPost) {
        console.log(" ----------------- if -----------------");
        stateHashedTargetPost[currHashPost].push(action.payload);
      } else {
        console.log(" ----------------- else -----------------");
        stateHashedTargetPost[currHashPost] = [];
        stateHashedTargetPost[currHashPost].push(action.payload);
      }

      console.log("stateHashedTargetPost");
      console.dir(stateHashedTargetPost);

      return {
        ...state,
        hashedTargetPost: stateHashedTargetPost,
      };
    case ACTIONS.ADD_POST_TO_STREAM:
      // const currentStream = state.stream.filter(post => post.id !== action.payload.id);
      return {
        ...state,
        stream: [action.payload, ...state.stream],
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
    case ACTIONS.ADD_TEMP_POST_ITEM:
      return {
        ...state,
        temp: [...state.temp, ...action.payload],
      };
    default:
      return state;
  }
};

export default postReducer;
