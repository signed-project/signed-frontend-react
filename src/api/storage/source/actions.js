import { ACTIONS } from "./reducer";

export const setPostStream = (payload) => ({
  type: ACTIONS.SET_STREAM,
  payload,
});

export const sendPost = (payload) => ({
  type: ACTIONS.SEND_POST,
  payload,
});

export const addTempSourceItem = (payload) => ({
  type: ACTIONS.ADD_TEMP_SOURCE_ITEM,
  payload,
});

export const setLatestSource = (payload) => ({
  type: ACTIONS.SET_SOURCE_LATEST,
  payload,
});

export const setAllReceivedNumber = (payload) => ({
  type: ACTIONS.ALL_RECEIVED_SOURCE_NUMBER,
  payload,
});

export const setCurrentAlreadySetNumber = (payload) => ({
  type: ACTIONS.CURRENT_ALREADY_SET_SOURCE_NUMBER,
  payload,
});
