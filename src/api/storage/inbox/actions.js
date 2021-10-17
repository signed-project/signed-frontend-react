import { ACTIONS } from "./reducer";

export const getInbox = (payload) => ({
    type: ACTIONS.GET_INBOX,
    payload
});

export const setPermission = (payload) => ({
    type: ACTIONS.SET_PERMISSION,
    payload
});
export const sendPermissionDecision = (payload) => ({
    type: ACTIONS.SEND_PERMISSION_DECISION,
    payload
});




