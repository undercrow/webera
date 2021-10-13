import * as era from "erajs";
import * as base64 from "js-base64";
import * as pako from "pako";
import {createSelector} from "reselect";
import {createAction, createReducer} from "typesafe-actions";

import Channel from "../channel";
import {State as RootState, ThunkAction} from "./index";
import {pushButton, pushLine, pushNewline, pushString, setAlign} from "./log";

export type State = {
	vm?: era.VM;
	channel?: Channel<string>;
	slot?: string;
};

const initial: State = {};

export const selector = (state: RootState): State => state.vm;
export const selectVM = createSelector(selector, (state) => state.vm);

export const setVM = createAction("VM/SET")<era.VM>();
export const setSlot = createAction("VM/SLOT/SET")<string>();

export type Action =
	| ReturnType<typeof setVM>
	| ReturnType<typeof setSlot>;
export const reducer = createReducer<State, Action>(initial, {
	"VM/SET": (state, action) => ({
		...state,
		vm: action.payload,
		channel: new Channel(),
	}),
	"VM/SLOT/SET": (state, action) => ({
		...state,
		slot: action.payload,
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
		const {vm, channel, slot} = getState().vm;
		if (vm == null || channel == null || slot == null) {
			return;
		}

		const storagePrefix = "slot-" + slot + "/";
		const runtime = vm.start({
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

		let input: string = "";
		while (true) {
			const next = runtime.next(input);
			input = "";
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
