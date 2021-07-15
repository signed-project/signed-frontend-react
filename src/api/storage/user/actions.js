import { ACTIONS } from "./reducer";



export const setUser = (payload) => ({
    type: ACTIONS.SET_USER,
    payload
})

export const getUser = (payload) => ({
    type: ACTIONS.GET_USER,
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

export const getHosts = (payload) => ({
    type: ACTIONS.GET_SOURCE_HOSTS,
    payload
});

export const setLoginError = (payload) => ({
    type: ACTIONS.SET_LOGIN_ERROR,
    payload
});

export const setLoading = (payload) => ({
    type: ACTIONS.SET_LOADING,
    payload
});

export const updateUser = (payload) => ({
    type: ACTIONS.UPDATE_USER,
    payload
});



