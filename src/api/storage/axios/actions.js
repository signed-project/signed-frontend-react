const { ACTIONS } = require("./reducer");

export const setToken = (action) => ({
    action: ACTIONS.SET_TOKEN,
    payload: action.payload
});

