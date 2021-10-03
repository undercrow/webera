import {createSelector} from "reselect";
import {createAction, createReducer} from "typesafe-actions";

import {Block, StringChunk} from "../typings/chunk";
import {createSubReducer, State as RootState} from "./index";

export type State = {
	blocks: Block[];
};

const initial: State = {
	blocks: [
		{
			chunks: [],
			align: "LEFT",
		},
	],
};

export const selector = (state: RootState): State => state.log;
export const selectBlocks = createSelector(selector, (state) => state.blocks);

export const pushNewline = createAction("LOG/BLOCK/PUSH/NEWLINE")();
export const pushString = createAction("LOG/BLOCK/PUSH/STRING")<Omit<StringChunk, "type">>();

export type Action =
	| ReturnType<typeof pushNewline>
	| ReturnType<typeof pushString>;
export const reducer = createReducer<State, Action>(initial, {
	"LOG/BLOCK/PUSH/NEWLINE": createSubReducer((state) => {
		const align = state.blocks[state.blocks.length - 1].align;
		state.blocks.push({
			chunks: [],
			align,
		});
	}),
	"LOG/BLOCK/PUSH/STRING": createSubReducer((state, action) => {
		const {text, cell} = action.payload;

		const lastBlock = state.blocks[state.blocks.length - 1];
		const lastChunk = lastBlock.chunks[lastBlock.chunks.length - 1];
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if (cell == null && lastChunk?.type === "string" && lastChunk.cell != null) {
			lastChunk.text += text;
		} else {
			lastBlock.chunks.push({type: "string", text, cell});
		}
	}),
});
