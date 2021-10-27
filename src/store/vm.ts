import * as era from "erajs";
import * as base64 from "js-base64";
import * as pako from "pako";
import {createSelector} from "reselect";
import {createAction, createReducer} from "typesafe-actions";

import {createSubReducer, State as RootState, ThunkAction} from "./index";
import {pushButton, pushLine, pushNewline, pushString, setAlign} from "./log";

type Input =
	| {type: "normal"; value: string}
	| {type: "pass"}
	| {type: "skip"};

let inputCallback: (() => void) | undefined;
export type State = {
	inputs: Input[];
	slot?: string;
};

const initial: State = {
	inputs: [],
};
let vm: era.VM | undefined;

export const selector = (state: RootState): State => state.vm;
const selectInput = createSelector(selector, (state) => state.inputs[0] as Input | undefined);

export const pushInput = createAction("VM/INPUT/PUSH")<Input>();
const shiftInput = createAction("VM/INPUT/SHIFT")();
const clearInput = createAction("VM/INPUT/CLEAR")();
export const setSlot = createAction("VM/SLOT/SET")<string>();

export type Action =
	| ReturnType<typeof pushInput>
	| ReturnType<typeof shiftInput>
	| ReturnType<typeof clearInput>
	| ReturnType<typeof setSlot>;
export const reducer = createReducer<State, Action>(initial, {
	"VM/INPUT/PUSH": createSubReducer((state, action) => {
		state.inputs.push(action.payload);
		if (inputCallback != null) {
			inputCallback();
			inputCallback = undefined;
		}
	}),
	"VM/INPUT/SHIFT": createSubReducer((state) => {
		state.inputs.shift();
	}),
	"VM/INPUT/CLEAR": createSubReducer((state) => {
		state.inputs = [];
	}),
	"VM/SLOT/SET": createSubReducer((state, action) => {
		state.slot = action.payload;
	}),
});

export function startVM(targetVM: era.VM, slot: string): ThunkAction<void> {
	return async (dispatch, getState) => {
		vm = targetVM;
		dispatch(clearInput());

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

		let output = iterator.next(null);
		while (true) {
			if (output.done === true) {
				break;
			}

			dispatch(setAlign(vm.alignment));
			switch (output.value.type) {
				case "newline": {
					dispatch(pushNewline());
					output = iterator.next(null);
					break;
				}
				case "string": {
					dispatch(pushString({
						text: output.value.text,
						cell: output.value.cell,
					}));
					output = iterator.next(null);
					continue;
				}
				case "button": {
					dispatch(pushButton({
						text: output.value.text,
						value: output.value.value,
						cell: output.value.cell,
					}));
					output = iterator.next(null);
					continue;
				}
				case "line": {
					dispatch(pushLine({
						value: output.value.value,
					}));
					output = iterator.next(null);
					continue;
				}
				case "clear": {
					// TODO
					output = iterator.next(null);
					continue;
				}
				case "input": {
					const input: Input | undefined = selectInput(getState());
					if (input == null) {
						await new Promise<void>((res) => { inputCallback = res; });
						continue;
					}

					switch (input.type) {
						case "skip": dispatch(shiftInput()); break;
						case "pass": dispatch(shiftInput()); break;
						case "normal": {
							if (output.value.numeric) {
								if (!isNaN(Number(input.value))) {
									output = iterator.next(input.value);
								}
							} else {
								output = iterator.next(input.value);
							}
							dispatch(shiftInput());
						}
					}
					break;
				}
				case "tinput": {
					const input: Input | undefined = selectInput(getState());
					if (input == null) {
						await new Promise<void>((res) => { inputCallback = res; });
						continue;
					}

					switch (input.type) {
						case "skip": dispatch(shiftInput()); break;
						case "pass": dispatch(shiftInput()); break;
						case "normal": {
							dispatch(shiftInput());
							if (output.value.numeric) {
								if (!isNaN(Number(input.value))) {
									output = iterator.next(input.value);
								}
							} else {
								output = iterator.next(input.value);
							}
						}
					}
					break;
				}
				case "wait": {
					const input: Input | undefined = selectInput(getState());
					if (input == null) {
						await new Promise<void>((res) => { inputCallback = res; });
						continue;
					}
					switch (input.type) {
						case "skip": {
							if (output.value.force) {
								dispatch(shiftInput());
							}
							output = iterator.next(null);
							break;
						}
						case "pass": {
							dispatch(shiftInput());
							output = iterator.next(null);
							break;
						}
						case "normal": {
							dispatch(shiftInput());
							output = iterator.next(null);
							break;
						}
					}
					break;
				}
			}
		}
	};
}
