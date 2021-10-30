import { ACTIONS } from "./reducer.js";

export const setCurrentStream = (payload) => {
  return {
    type: ACTIONS.SET_CURRENT_STREAM,
    payload,
  };
};
