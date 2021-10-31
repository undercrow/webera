import {Output} from "erajs";
import {createSelector} from "reselect";
import {createAction, createReducer} from "typesafe-actions";

import {createSubReducer, State as RootState} from "./index";

export type State = {
	blocks: Output[];
	textified: number;
};

const initial: State = {
	blocks: [],
	textified: -1,
};

export const selector = (state: RootState): State => state.log;
export const selectBlocks = createSelector(selector, (state) => state.blocks);
export const selectTextified = createSelector(selector, (state) => state.textified);

export const refreshTextified = createAction("LOG/BLOCK/TEXTIFY/REFRESH")();
export const pushBlock = createAction("LOG/BLOCK/PUSH")<Output>();
export const popBlock = createAction("LOG/BLOCK/POP")<number>();
export const clearBlocks = createAction("LOG/BLOCK/CLEAR")();

export type Action =
	| ReturnType<typeof refreshTextified>
	| ReturnType<typeof pushBlock>
	| ReturnType<typeof popBlock>
	| ReturnType<typeof clearBlocks>;
export const reducer = createReducer<State, Action>(initial, {
	"LOG/BLOCK/TEXTIFY/REFRESH": createSubReducer((state) => {
		state.textified = state.blocks.length - 1;
	}),
	"LOG/BLOCK/PUSH": createSubReducer((state, action) => {
		state.blocks.push(action.payload);
	}),
	"LOG/BLOCK/POP": createSubReducer((state, action) => {
		for (let i = 0; i < action.payload; ++i) {
			state.blocks.pop();
		}
	}),
	"LOG/BLOCK/CLEAR": createSubReducer((state) => {
		state.blocks = [];
		state.textified = -1;
	}),
});
