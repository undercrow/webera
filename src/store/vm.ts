import * as era from "erajs";
import {createSelector} from "reselect";
import {createAction, createReducer} from "typesafe-actions";

import type {State as RootState} from "./index";

export type State = {
	vm?: era.VM;
};

const initial: State = {};

export const selector = (state: RootState): State => state.vm;
export const selectVM = createSelector(selector, (state) => state.vm);

export const setVM = createAction("VM/SET")<era.VM>();

export type Action =
	| ReturnType<typeof setVM>;
export const reducer = createReducer<State, Action>(initial, {
	"VM/SET": (state, action) => ({
		...state,
		vm: action.payload,
	}),
});
