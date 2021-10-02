import {createSelector} from "reselect";
import {createAction, createReducer} from "typesafe-actions";

import type {State as RootState} from "./index";

export type State = {
	foo: "BAR";
};

const initial: State = {
	foo: "BAR",
};

export const selector = (state: RootState): State => state.log;
export const selectFoo = createSelector(selector, (state) => state.foo);

export const foo = createAction("LOG/FOO")();

export type Action =
	| ReturnType<typeof foo>;
export const reducer = createReducer<State, Action>(initial, {
	"LOG/FOO": (state) => {
		return state;
	},
});
