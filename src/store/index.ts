import {useDispatch as rawUseDispatch, useSelector as rawUseSelector} from "react-redux";
import {applyMiddleware, combineReducers, compose, createStore} from "redux";
import thunk from "redux-thunk";
import type * as Thunk from "redux-thunk";

import * as log from "./log";
import * as vm from "./vm";

export type State = {
	log: log.State;
	vm: vm.State;
};

export type Action =
	| log.Action
	| vm.Action;
export type ThunkAction<R> = Thunk.ThunkAction<R, State, undefined, Action>;
export type AsyncThunkAction<R> = Thunk.ThunkAction<Promise<R>, State, undefined, Action>;
export type ThunkDispatch = Thunk.ThunkDispatch<State, undefined, Action>;

const reducer = combineReducers({
	log: log.reducer,
});

/* eslint-disable */
let composeEnhancers: typeof compose;
if (
	process.env.NODE_ENV === "development" &&
	(window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ != null
) {
	composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
} else {
	composeEnhancers = compose;
}
/* eslint-enable */

const store = createStore(
	reducer,
	composeEnhancers(applyMiddleware(thunk)),
);
export default store;

export function useDispatch(): Thunk.ThunkDispatch<State, undefined, Action> {
	return rawUseDispatch();
}

export function useSelector<T>(selector: (state: State) => T): T {
	return rawUseSelector(selector);
}
