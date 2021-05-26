
export const ACTIONS = {
    SEND_SOURCE: 'SOURCE::SEND_SOURCE',
    SET_SOURCE_HASH: 'SOURCE::SET_SOURCE_HASH',
    SET_SOURCE_LATEST: 'SOURCE::SET_SOURCE_LATEST',
};


const initialState = {
    latest: [],
    hashed: []
};

const sourceReducer = (state = initialState, action) => {
    switch (action.type) {
        case ACTIONS.SET_SOURCE_HASH:
            return {
                ...state,
                hashed: action.payload,
            };
        case ACTIONS.SET_SOURCE_LATEST:
            return {
                ...state,
                latest: action.payload,
            };
        default:
            return state;
    }
};

export default sourceReducer;