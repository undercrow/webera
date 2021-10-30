import {VM} from "erajs";
import jszip from "jszip";
import localforage from "localforage";
import pako from "pako";
import {createSelector} from "reselect";
import {createAction, createReducer} from "typesafe-actions";

import * as era from "../era";
import Metadata from "../typings/metadata";
import {createSubReducer, State as RootState, ThunkAction} from "./index";
import {clearBlocks, pushOutput} from "./log";

type Input =
	| {type: "normal"; value: string}
	| {type: "pass"}
	| {type: "skip"};

let inputCallback: (() => void) | undefined;
export type State = {
	error?: Error;
	nonce: number;
	inputs: Input[];
};

const initial: State = {
	nonce: 0,
	inputs: [],
};
let vm: VM | undefined;

export const selector = (state: RootState): State => state.vm;
export const selectError = createSelector(selector, (state) => state.error);
const selectNonce = createSelector(selector, (state) => state.nonce);
const selectInput = createSelector(selector, (state) => state.inputs[0] as Input | undefined);

export const setError = createAction("VM/ERROR/SET")<Error>();
export const delError = createAction("VM/ERROR/DEL")();
const incNonce = createAction("VM/NONCE/INC")();
export const pushInput = createAction("VM/INPUT/PUSH")<Input>();
const shiftInput = createAction("VM/INPUT/SHIFT")();
const clearInput = createAction("VM/INPUT/CLEAR")();

export type Action =
	| ReturnType<typeof setError>
	| ReturnType<typeof delError>
	| ReturnType<typeof incNonce>
	| ReturnType<typeof pushInput>
	| ReturnType<typeof shiftInput>
	| ReturnType<typeof clearInput>;
export const reducer = createReducer<State, Action>(initial, {
	"VM/ERROR/SET": createSubReducer((state, action) => {
		state.error = action.payload;
	}),
	"VM/ERROR/DEL": createSubReducer((state) => {
		state.error = undefined;
	}),
	"VM/NONCE/INC": createSubReducer((state) => {
		state.nonce += 1;
	}),
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
});

export function startVM(slot: string): ThunkAction<Promise<void>> {
	return async (dispatch, getState) => {
		dispatch(delError());
		dispatch(clearBlocks());

		const metadata = await localforage.getItem<Metadata>("metadata/" + slot);
		if (metadata == null) {
			dispatch(setError(new Error(`Metadata for slot ${slot} does not exist`)));
			return;
		}

		const raw = await localforage.getItem<File>("files/" + slot);
		if (raw == null) {
			dispatch(setError(new Error(`File for slot ${slot} does not exist`)));
			return;
		}

		const zip = await jszip.loadAsync(await raw.arrayBuffer());
		const files = await era.extract(zip);
		vm = era.compile(files);

		dispatch(incNonce());
		dispatch(clearInput());
		if (inputCallback != null) {
			inputCallback();
		}

		const storagePrefix = `save/${slot}/`;
		const iterator = vm.start({
			getSavedata: async (key) => {
				const bytes = await localforage.getItem<Uint8Array>(storagePrefix + key + ".gz");
				if (bytes == null) {
					return undefined;
				}

				return pako.ungzip(bytes, {to: "string"});
			},
			setSavedata: async (key, value) => {
				await localforage.setItem(storagePrefix + key + ".gz", pako.gzip(value));
			},
			getFont: () => false,
			getTime: () => new Date().valueOf(),
		});

		try {
			const nonce = selectNonce(getState());
			let output = await iterator.next(null);
			while (true) {
				if (output.done === true || nonce !== selectNonce(getState())) {
					break;
				}

				switch (output.value.type) {
					case "content": {
						dispatch(pushOutput(output.value));
						output = await iterator.next(null);
						break;
					}
					case "line": {
						dispatch(pushOutput(output.value));
						output = await iterator.next(null);
						continue;
					}
					case "clear": {
						// TODO
						output = await iterator.next(null);
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
										output = await iterator.next(input.value);
									}
								} else {
									output = await iterator.next(input.value);
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
										output = await iterator.next(input.value);
									}
								} else {
									output = await iterator.next(input.value);
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
								output = await iterator.next(null);
								break;
							}
							case "pass": {
								dispatch(shiftInput());
								output = await iterator.next(null);
								break;
							}
							case "normal": {
								dispatch(shiftInput());
								output = await iterator.next(null);
								break;
							}
						}
						break;
					}
				}
			}
		} catch (e) {
			dispatch(setError(e as Error));
		}
	};
}
