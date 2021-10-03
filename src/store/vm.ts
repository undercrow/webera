import * as era from "erajs";
import {createSelector} from "reselect";
import {createAction, createReducer} from "typesafe-actions";

import Channel from "../channel";
import type {State as RootState, ThunkAction} from "./index";
import {pushNewline, pushString} from "./log";

export type State = {
	vm?: era.VM;
	channel?: Channel<string>;
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
		channel: new Channel(),
	}),
});

export function pushInput(value: string): ThunkAction<void> {
	return (_dispatch, getState) => {
		const channel = getState().vm.channel;
		if (channel == null) {
			return;
		}

		channel.push(value);
	};
}

export function startVM(): ThunkAction<void> {
	return async (dispatch, getState) => {
		const {vm, channel} = getState().vm;
		if (vm == null || channel == null) {
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
					if (next.value.text === "\n") {
						dispatch(pushNewline());
					} else {
						dispatch(pushString({
							text: next.value.text,
							cell: next.value.cell,
						}));
					}
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
				case "input": {
					input = await channel.pop();
					break;
				}
				case "wait": {
					input = await channel.pop();
					break;
				}
				default: {
					throw new Error(`${next.value.type} is not implemented yet`);
				}
			}
		}
	};
}
