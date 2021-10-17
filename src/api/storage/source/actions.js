import { ACTIONS } from './reducer';

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
