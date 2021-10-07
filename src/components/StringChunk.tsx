import {h, Fragment} from "preact";

import classnames from "classnames";
import type {FunctionComponent} from "preact";
import {createUseStyles} from "react-jss";

import ButtonChunkComponent from "../components/ButtonChunk";
import * as sx from "../style-util";
import {ButtonChunk, StringChunk} from "../typings/chunk";

function parseChunk(chunk: StringChunk): (ButtonChunk | StringChunk)[] {
	const {text, cell} = chunk;
	const result: (ButtonChunk | StringChunk)[] = [];

	const buttonMatch = [...text.matchAll(/\s*\[\s*(?<value>\d+)\s*\]\s*/g)];
	if (buttonMatch.length === 0) {
		return [chunk];
	}

	const firstMatch = buttonMatch[0];
	const lastMatch = buttonMatch[buttonMatch.length - 1];
	if (firstMatch.index === 0) {
		for (let i = 0; i < buttonMatch.length; ++i) {
			const curMatch = buttonMatch[i];
			const nextMatch = buttonMatch[i + 1];
			const start = curMatch.index;
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			const end = nextMatch?.index ?? text.length;
			result.push({
				type: "button",
				value: curMatch.groups!.value,
				text: text.slice(start, end),
				cell,
			});
		}
	} else if (lastMatch.index! + lastMatch[0].length === text.length) {
		for (let i = 0; i < buttonMatch.length; ++i) {
			const prevMatch = buttonMatch[i - 1];
			const curMatch = buttonMatch[i];
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			const start = prevMatch != null ? prevMatch.index! + prevMatch.length : 0;
			const end = curMatch.index! + curMatch[0].length;
			result.push({
				type: "button",
				value: curMatch.groups!.value,
				text: text.slice(start, end),
				cell,
			});
		}
	} else {
		result.push(chunk);
	}
	return result;
}

const useStyles = createUseStyles({
	root: {
		...sx.hflex,
		minHeight: "1em",
		fontSize: 16,
		lineHeight: 1.6,
	},
	leftAlign: {
		minWidth: "15em",
		justifyContent: "flex-start",
		textAlign: "left",
	},
	rightAlign: {
		minWidth: "15em",
		justifyContent: "flex-end",
		textAlign: "right",
	},
});

type Props = {
	textified: boolean;
	chunk: StringChunk;
};

const StringChunkComponent: FunctionComponent<Props> = (props) => {
	const {chunk, textified} = props;
	const styles = useStyles();

	let alignStyle: string;
	switch (chunk.cell) {
		case "LEFT": alignStyle = styles.leftAlign; break;
		case "RIGHT": alignStyle = styles.rightAlign; break;
		default: alignStyle = ""; break;
	}

	if (textified) {
		return <span className={classnames(styles.root, alignStyle)}>{chunk.text}</span>;
	} else {
		return (
			<Fragment>
				{parseChunk(chunk).map((c) => {
					switch (c.type) {
						case "button": return <ButtonChunkComponent chunk={c} />;
						case "string": return <StringChunkComponent textified chunk={chunk} />;
					}
				})}
			</Fragment>
		);
	}
};

export default StringChunkComponent;
