export type ButtonChunk = {
	type: "button";
	text: string;
	value: string;
	cell?: "LEFT" | "RIGHT";
};

export type StringChunk = {
	type: "string";
	text: string;
	cell?: "LEFT" | "RIGHT";
};

export type Chunk = ButtonChunk | StringChunk;
export type Block = {
	chunks: Chunk[];
	align: "LEFT" | "CENTER" | "RIGHT";
};
