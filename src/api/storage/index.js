import { combineReducers, createStore, applyMiddleware } from "redux";
import { reducer as axiosReducer } from "../storage/axios";
import { reducer as userReducer } from "../storage/user";
import { reducer as postReducer } from "../storage/post";
import { composeWithDevTools } from "redux-devtools-extension";
import logger from "redux-logger";

import createSagaMiddleware from "redux-saga";
import saga from "../saga";

const reducer = combineReducers({
    axios: axiosReducer,
    post: postReducer,
    user: userReducer,
});

const sagaMiddleware = createSagaMiddleware();

let store;
if (process.env.NODE_ENV === "development") {
    store = createStore(
        reducer,
        composeWithDevTools(applyMiddleware(logger, sagaMiddleware))
    );
} else {
    store = createStore(reducer, applyMiddleware(sagaMiddleware));
}
sagaMiddleware.run(saga);

export default store;