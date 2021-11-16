export const ACTIONS = {
  SEND_SOURCE: "SOURCE::SEND_SOURCE",
  SET_SOURCE_HASH: "SOURCE::SET_SOURCE_HASH",
  UPDATE_SOURCE_HASH: "SOURCE::UPDATE_SOURCE_HASH",
  SET_SOURCE_LATEST: "SOURCE::SET_SOURCE_LATEST",
  UPDATE_SOURCE_LATEST: "SOURCE::UPDATE_SOURCE_LATEST",
  ADD_TEMP_SOURCE_ITEM: "SOURCE::ADD_TEMP_SOURCE_ITEM",
  ALL_RECEIVED_SOURCE_NUMBER: "SOURCE::ALL_RECEIVED_SOURCE_NUMBER",
  CURRENT_ALREADY_SET_SOURCE_NUMBER:
    "SOURCE::CURRENT_ALREADY_SET_SOURCE_NUMBER",
  SET_SUBSCRIBED_SOURCES: "SOURCE::SET_SUBSCRIBED_SOURCES",
};

const initialState = {
  latest: [],
  hashed: [],
  temp: [],
  allReceivedNumber: "",
  currentAlreadySetNumber: "",
  subscribed: [],
};

const sourceReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_SOURCE_HASH:
      return {
        ...state,
        hashed: action.payload,
      };
    case ACTIONS.SET_SUBSCRIBED_SOURCES: {
      return {
        ...state,
        subscribed: [...action.payload],
      };
    }
    case ACTIONS.SET_SOURCE_LATEST:
      return {
        ...state,
        latest: action.payload,
      };
    case ACTIONS.UPDATE_SOURCE_LATEST:
      // const updateSource = { [action.payload.address]: action.payload.address };
      return {
        ...state,
        latest: {
          ...state.latest,
          [action.payload.address]: action.payload,
        },
      };
    case ACTIONS.ADD_TEMP_SOURCE_ITEM:
      return {
        ...state,
        temp: [...state.temp, action.payload],
      };
    case ACTIONS.ALL_RECEIVED_SOURCE_NUMBER:
      return {
        ...state,
        allReceivedNumber: action.payload,
      };
    case ACTIONS.CURRENT_ALREADY_SET_SOURCE_NUMBER:
      return {
        ...state,
        currentAlreadySetNumber: action.payload,
      };
    default:
      return state;
  }
};

export default sourceReducer;
