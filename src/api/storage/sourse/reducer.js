
export const ACTIONS = {
    PUBLISH_POST: 'SOURCE::PUBLISH_POST',
    SEND_POST: 'SOURCE::SEND_POST',
    SET_STREAM: 'SOURCE::SET_POST_STREAM',
    TEST: 'SOURCE::TEST',
};


const initialState = {
    stream: []
}

const sourceReducer = (state = initialState, action) => {
    switch (action.type) {
        case ACTIONS.SET_STREAM:
            return {
                ...state,
                stream: action.payload,
            };
        default:
            return state;
    }
};

export default sourceReducer;