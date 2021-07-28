
import { ACTIONS } from "./reducer";

export const setPostStream = (payload) => ({
  type: ACTIONS.SET_STREAM,
  payload,
});

export const updatePostStream = (payload) => ({
  type: ACTIONS.UPDATE_POST_STREAM,
  payload,
});

export const sendPost = (payload) => ({
  type: ACTIONS.SEND_POST,
  payload,
});

export const updatePost = (payload) => ({
  type: ACTIONS.UPDATE_POST,
  payload,
});

export const getIndex = (payload) => ({
  type: ACTIONS.GET_INDEX,
  payload,
});

 
