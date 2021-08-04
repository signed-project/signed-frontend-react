import { ACTIONS } from "./reducer";

export const getInbox = (payload) => ({
    type: ACTIONS.GET_INBOX,
    payload
});

export const setPermission = (payload) => ({
    type: ACTIONS.SET_PERMISSION,
    payload
});




