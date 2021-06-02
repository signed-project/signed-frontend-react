import { ACTIONS } from "./reducer";



export const setUser = (payload) => ({
    type: ACTIONS.SET_USER,
    payload
})

export const getUserByToken = (payload) => ({
    type: ACTIONS.GET_USER_DATA_BY_TOKEN,
    payload
});

export const sendRegisterData = (payload) => ({
    type: ACTIONS.SEND_REGISTER_DATA,
    payload
});

export const send = (payload) => ({
    type: ACTIONS.SEND_USER_DATA,
    payload
});

export const sendLoginData = (payload) => ({
    type: ACTIONS.SEND_LOGIN_DATA,
    payload
});


