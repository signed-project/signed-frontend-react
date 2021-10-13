
export const ACTIONS = {
    SEND_SOURCE: 'SOURCE::SEND_SOURCE',
    SET_SOURCE_HASH: 'SOURCE::SET_SOURCE_HASH',
    UPDATE_SOURCE_HASH: 'SOURCE::UPDATE_SOURCE_HASH',
    SET_SOURCE_LATEST: 'SOURCE::SET_SOURCE_LATEST',
    UPDATE_SOURCE_LATEST: 'SOURCE::UPDATE_SOURCE_LATEST',
    ADD_TEMP_SOURCE_ITEM: 'SOURCE::ADD_TEMP_SOURCE_ITEM',
};

const initialState = {
    latest: [],
    hashed: [],
    tempSource: []
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
        case ACTIONS.UPDATE_SOURCE_LATEST:
            // const updateSource = { [action.payload.address]: action.payload.address };
            return {
                ...state,
                latest: {
                    ...state.latest,
                    [action.payload.address]: action.payload
                }
            };
        case ACTIONS.ADD_TEMP_SOURCE_ITEM:
            // const updateSource = { [action.payload.address]: action.payload.address };
            return {
                ...state,
                tempSource: [
                    ...state.tempSource,
                    action.payload
                ]
            };
        default:
            return state;
    }
};

export default sourceReducer;