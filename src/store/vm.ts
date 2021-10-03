import * as era from "erajs";
import {createSelector} from "reselect";
import {createAction, createReducer} from "typesafe-actions";

import type {State as RootState, ThunkAction} from "./index";

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

export function startVM(): ThunkAction<void> {
	return (_dispatch, getState) => {
		const vm = getState().vm.vm;
		if (vm == null) {
			return;
		}

		const runtime = vm.start();

		let input: string = "";
		while (true) {
			const next = runtime.next(input);
			input = "";
			if (next.done === true) {
				break;
			}
			switch (next.value.type) {
				case "string": {
					break;
				}
				case "button": {
					break;
				}
				case "line": {
					break;
				}
				case "clearline": {
					break;
				}
				default: {
					throw new Error(`${next.value.type} is not implemented yet`);
				}
			}
		}
	};
}
