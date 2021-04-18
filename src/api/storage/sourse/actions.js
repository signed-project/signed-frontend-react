import { ACTIONS } from './reducer';

export const setPostStream = (payload) => ({
    type: ACTIONS.SET_STREAM,
    payload,
});

export const publishPost = (payload) => ({
    type: ACTIONS.PUBLISH_POST,
    payload,
});

