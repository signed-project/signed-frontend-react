import { ACTIONS } from "./reducer";



export const setUser = (payload) => ({
    type: ACTIONS.SET_USER,
    payload
})

export const getUserData = (payload) => ({
    type: ACTIONS.GET_USER_DATA,
    payload
});

export const getPairTokens = (payload) => ({
    type: ACTIONS.GET_PAIRS_TOKEN,
    payload
});


