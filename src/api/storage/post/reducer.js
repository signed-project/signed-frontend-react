
export const ACTIONS = {
    SEND_POST: 'POST::SEND_POST',
    SET_POST_STREAM: 'POST::SET_POST_STREAM',
    SET_POST_HASH: 'POST::ADD_POST_TO_STREAM',
    SET_POST_LATEST: 'POST::ADD_POST_TO_STREAM',
};


const initialState = {
    stream: [],
    latestPost: new Map(),
    hashedPost: new Map()
};

const postReducer = (state = initialState, action) => {
    switch (action.type) {
        case ACTIONS.SET_POST_STREAM:
            return {
                ...state,
                stream: action.payload,
            };
        case ACTIONS.SET_POST_LATEST:
            return {
                ...state,
                latestPost: action.payload,
            };
        case ACTIONS.SET_POST_HASH:
            return {
                ...state,
                hashedPost: action.payload,
            };
        case ACTIONS.ADD_POST_TO_STREAM:
            const newStream = state.stream;
            newStream.push(action.payload);
            return {
                ...state,
                stream: newStream
            };
        default:
            return state;
    }
};

export default postReducer;