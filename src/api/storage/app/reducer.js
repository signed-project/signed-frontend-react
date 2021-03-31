
export const ACTIONS = {
    TEST: 'APP::TEST',
};


const initialState = {
    test: ''
}

const axiosReducer = (state = initialState, action) => {
    switch (action.type) {
        case ACTIONS.TEST:
            return {
                ...state,
                test: action.payload,
            };
        default:
            return state;
    }
};

export default axiosReducer;