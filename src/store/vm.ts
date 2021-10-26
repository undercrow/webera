import * as era from "erajs";
import * as base64 from "js-base64";
import * as pako from "pako";
import {createSelector} from "reselect";
import {createAction, createReducer} from "typesafe-actions";

import Channel from "../channel";
import {createSubReducer, State as RootState, ThunkAction} from "./index";
import {pushButton, pushLine, pushNewline, pushString, setAlign} from "./log";

export type State = {
	request?: era.Output;
	slot?: string;
};
type Runtime = {
	vm?: era.VM;
	channel?: Channel<string | null>;
};

const initial: State = {};
const runtime: Runtime = {};

export const selector = (state: RootState): State => state.vm;
const selectRequest = createSelector(selector, (state) => state.request);

const delRequest = createAction("VM/REQUEST/DEL")();
const setRequest = createAction("VM/REQUEST/SET")<era.Output>();
export const setSlot = createAction("VM/SLOT/SET")<string>();

export type Action =
	| ReturnType<typeof delRequest>
	| ReturnType<typeof setRequest>
	| ReturnType<typeof setSlot>;
export const reducer = createReducer<State, Action>(initial, {
	"VM/REQUEST/DEL": createSubReducer((state) => {
		state.request = undefined;
	}),
	"VM/REQUEST/SET": createSubReducer((state, action) => {
		state.request = action.payload;
	}),
	"VM/SLOT/SET": createSubReducer((state, action) => {
		state.slot = action.payload;
	}),
});

export function skipWait(): ThunkAction<void> {
	return async (_dispatch, getState) => {
		const channel = runtime.channel;
		if (channel == null) {
			return;
		}

		while (true) {
			const request = selectRequest(getState());
			if (request == null || request.type !== "wait" || request.force) {
				break;
			}

			channel.push(null);
			await channel.flush();
		}
	};
}

export function pushInput(value: string | null): ThunkAction<void> {
	return (_dispatch, getState) => {
		const request = selectRequest(getState());
		const channel = runtime.channel;
		if (channel == null || request == null) {
			return;
		}

		switch (request.type) {
			case "wait": {
				channel.push(null);
				break;
			}
			case "input": {
				if (request.numeric) {
					if (value != null && !isNaN(Number(value))) {
						channel.push(value);
					}
				} else {
					if (value != null) {
						channel.push(value);
					}
				}
				break;
			}
			case "tinput": {
				// TODO
				if (request.numeric) {
					if (value != null && !isNaN(Number(value))) {
						channel.push(value);
					}
				} else {
					if (value != null) {
						channel.push(value);
					}
				}
				break;
			}
			default: return;
		}
	};
}

export function startVM(vm: era.VM, slot: string): ThunkAction<void> {
	return async (dispatch) => {
		runtime.vm = vm;
		runtime.channel = new Channel();
		dispatch(delRequest());

		const storagePrefix = "slot-" + slot + "/";
		const iterator = vm.start({
			getSavedata: (key) => {
				const raw = localStorage.getItem(storagePrefix + key + ".gz");
				if (raw == null) {
					return undefined;
				}

				const decoded = base64.toUint8Array(raw);
				const uncompressed = pako.ungzip(decoded, {to: "string"});

				return uncompressed;
			},
			setSavedata: (key, value) => {
				const compressed = pako.gzip(value);
				const encoded = base64.fromUint8Array(compressed);
				localStorage.setItem(storagePrefix + key + ".gz", encoded);
			},
			getFont: () => false,
			getTime: () => new Date().valueOf(),
		});

		let input: string | null = null;
		while (true) {
			const next = iterator.next(input);
			input = null;
			if (next.done === true) {
				break;
			}
			dispatch(setAlign(vm.alignment));
			switch (next.value.type) {
				case "newline": {
					dispatch(pushNewline());
					break;
				}
				case "string": {
					dispatch(pushString({
						text: next.value.text,
						cell: next.value.cell,
					}));
					break;
				}
				case "button": {
					dispatch(pushButton({
						text: next.value.text,
						value: next.value.value,
						cell: next.value.cell,
					}));
					break;
				}
				case "line": {
					dispatch(pushLine({
						value: next.value.value,
					}));
					break;
				}
				case "clear": {
					// TODO
					break;
				}
				case "input": {
					dispatch(setRequest(next.value));
					input = await runtime.channel.pop();
					break;
				}
				case "tinput": {
					dispatch(setRequest(next.value));
					input = await runtime.channel.pop();
					break;
				}
				case "wait": {
					dispatch(setRequest(next.value));
					await runtime.channel.pop();
					break;
				}
			}
		}
	};
}
