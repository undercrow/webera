import * as era from "erajs";
import * as base64 from "js-base64";
import * as pako from "pako";
import {createAction, createReducer} from "typesafe-actions";

import Channel from "../channel";
import {State as RootState, ThunkAction} from "./index";
import {pushButton, pushLine, pushNewline, pushString, setAlign} from "./log";

export type State = {
	slot?: string;
};
type Runtime = {
	vm?: era.VM;
	channel?: Channel<string | null>;
};

const initial: State = {};
const runtime: Runtime = {};

export const selector = (state: RootState): State => state.vm;

export const setSlot = createAction("VM/SLOT/SET")<string>();

export type Action =
	| ReturnType<typeof setSlot>;
export const reducer = createReducer<State, Action>(initial, {
	"VM/SLOT/SET": (state, action) => ({
		...state,
		slot: action.payload,
	}),
});

export function pushInput(value: string): ThunkAction<void> {
	return () => {
		const channel = runtime.channel;
		if (channel == null) {
			return;
		}

		channel.push(value);
	};
}

export function startVM(vm: era.VM, slot: string): ThunkAction<void> {
	return async (dispatch) => {
		runtime.vm = vm;
		runtime.channel = new Channel();

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
					input = await runtime.channel.pop();
					break;
				}
				case "tinput": {
					input = await runtime.channel.pop();
					break;
				}
				case "wait": {
					await runtime.channel.pop();
					break;
				}
			}
		}
	};
}
