import localforage from "localforage";
import {createSelector} from "reselect";
import {createAction, createReducer} from "typesafe-actions";

import Metadata, {Slot} from "../typings/metadata";
import {createSubReducer, State as RootState, ThunkAction} from "./index";

export type State = {
	active?: string;
	slots: Record<string, Slot>;
	isRehydrating: boolean;
	isCreating: Record<string, boolean>;
	isDeleting: Record<string, boolean>;
};

const initial: State = {
	slots: {},
	isRehydrating: false,
	isCreating: {},
	isDeleting: {},
};

export const selector = (state: RootState): State => state.slot;
export const selectActive = createSelector(selector, (state) => state.active);
export const selectSlots = createSelector(selector, (state) => state.slots);
export const selectIsRehydrating = createSelector(selector, (state) => state.isRehydrating);
export const selectIsDeleting =
	(name: string) => (state: RootState) => state.slot.isDeleting[name];

const setActive = createAction("SLOT/ACTIVE/SET")<string | undefined>();
const setSlot = createAction("SLOT/SET")<Slot>();
const delSlot = createAction("SLOT/DEL")<string>();
const clearSlot = createAction("SLOT/CLEAR")();
const setIsRehydrating = createAction("SLOT/IS_REHYDRATING/SET")<boolean>();
const setIsDeleting = createAction("SLOT/IS_DELETING/SET")<[string, boolean]>();

export type Action =
	| ReturnType<typeof setActive>
	| ReturnType<typeof setSlot>
	| ReturnType<typeof delSlot>
	| ReturnType<typeof clearSlot>
	| ReturnType<typeof setIsRehydrating>
	| ReturnType<typeof setIsDeleting>;
export const reducer = createReducer<State, Action>(initial, {
	"SLOT/ACTIVE/SET": createSubReducer((state, action) => {
		state.active = action.payload;
	}),
	"SLOT/DEL": createSubReducer((state, action) => {
		delete state.slots[action.payload];
	}),
	"SLOT/SET": createSubReducer((state, action) => {
		const slot = action.payload;
		state.slots[slot.name] = slot;
	}),
	"SLOT/CLEAR": createSubReducer((state) => {
		state.slots = {};
	}),
	"SLOT/IS_REHYDRATING/SET": createSubReducer((state, action) => {
		state.isRehydrating = action.payload;
	}),
	"SLOT/IS_DELETING/SET": createSubReducer((state, action) => {
		const [name, value] = action.payload;
		state.isDeleting[name] = value;
	}),
});

export function rehydrateSlots(): ThunkAction<Promise<void>> {
	return async (dispatch) => {
		dispatch(setIsRehydrating(true));
		dispatch(clearSlot());
		for (const key of await localforage.keys()) {
			if (!key.startsWith("metadata/")) {
				continue;
			}

			const metadata = await localforage.getItem<Metadata>(key);
			dispatch(setSlot(metadata!.slot));
		}
		dispatch(setIsRehydrating(false));
	};
}

export function createSlot(slot: Slot, file: File): ThunkAction<Promise<void>> {
	return async (dispatch) => {
		await localforage.setItem("metadata/" + slot.name, {slot});
		await localforage.setItem("files/" + slot.name, file);
		dispatch(setSlot(slot));
	};
}

export function removeSlot(name: string): ThunkAction<Promise<void>> {
	return async (dispatch) => {
		dispatch(setIsDeleting([name, true]));
		await localforage.removeItem("metadata/" + name);
		await localforage.removeItem("files/" + name);
		dispatch(delSlot(name));
		dispatch(setIsDeleting([name, false]));
	};
}
