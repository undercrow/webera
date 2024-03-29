import produce, {Draft} from "immer";
import {useDispatch as rawUseDispatch, useSelector as rawUseSelector} from "react-redux";
import {applyMiddleware, combineReducers, compose, createStore} from "redux";
import thunk from "redux-thunk";
import type * as Thunk from "redux-thunk";

import * as log from "./log";
import * as slot from "./slot";
import * as vm from "./vm";

export type State = {
	log: log.State;
	slot: slot.State;
	vm: vm.State;
};

export type Action =
	| log.Action
	| slot.Action
	| vm.Action;
export type ThunkAction<R> = Thunk.ThunkAction<R, State, undefined, Action>;
export type ThunkDispatch = Thunk.ThunkDispatch<State, undefined, Action>;

const reducer = combineReducers({
	log: log.reducer,
	slot: slot.reducer,
	vm: vm.reducer,
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

type SubReducer<S, A> = (state: Draft<S>, action: A) => void;
export function createSubReducer<S, A>(fn: SubReducer<S, A>): (state: S, action: A) => S {
	return (state: S, action: A) => produce(state, (s) => fn(s, action));
}
