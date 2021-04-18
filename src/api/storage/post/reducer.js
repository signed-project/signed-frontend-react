
export const ACTIONS = {
    SEND_POST: 'POST::SEND_POST',
    SET_POST_STREAM: 'POST::SET_POST_STREAM',
    ADD_POST_TO_STREAM: 'POST::ADD_POST_TO_STREAM',
    TEST: 'POST::TEST',
};


const initialState = {
    stream: []
}

const postReducer = (state = initialState, action) => {
    switch (action.type) {
        case ACTIONS.SET_POST_STREAM:
            return {
                ...state,
                stream: action.payload,
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