export type ButtonChunk = {
	type: "button";
	text: string;
	value: string;
	cell?: "LEFT" | "RIGHT";
};

export type LineChunk = {
	type: "line";
	value?: string;
};

export type StringChunk = {
	type: "string";
	text: string;
	cell?: "LEFT" | "RIGHT";
};

export type Chunk = ButtonChunk | LineChunk | StringChunk;
export type Block = {
	chunks: Chunk[];
	align: "LEFT" | "CENTER" | "RIGHT";
};
