import { ACTIONS } from "./reducer.js";

export const setLoadedStream = (payload) => {
  return {
    type: ACTIONS.SET_LOADED_STREAM,
    payload,
  };
};
