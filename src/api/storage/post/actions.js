import { ACTIONS } from "./reducer";

export const setPostStream = (payload) => ({
  type: ACTIONS.SET_STREAM,
  payload,
});

export const updatePostStream = (payload) => ({
  type: ACTIONS.UPDATE_POST_STREAM,
  payload,
});

export const setAlreadyLoadedPosts = (payload) => ({
  type: ACTIONS.SET_ALREADY_LOADED_POSTS,
  payload,
});

export const setLoadedPosts = (payload) => ({
  type: ACTIONS.SET_LOADED_POSTS,
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

export const addTempPost = (payload) => ({
  type: ACTIONS.ADD_TEMP_POST_ITEM,
  payload,
});
