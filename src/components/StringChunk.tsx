import {h} from "preact";

import classnames from "classnames";
import {StringChunk} from "erajs";
import type {FunctionComponent} from "preact";
import {createUseStyles} from "react-jss";

import * as sx from "../style-util";

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
	chunk: StringChunk;
};

const StringChunkComponent: FunctionComponent<Props> = (props) => {
	const {chunk} = props;
	const styles = useStyles();

	let alignStyle: string;
	switch (chunk.cell) {
		case "LEFT": alignStyle = styles.leftAlign; break;
		case "RIGHT": alignStyle = styles.rightAlign; break;
		default: alignStyle = ""; break;
	}

	return <span className={classnames(styles.root, alignStyle)}>{chunk.text}</span>;
};

export default StringChunkComponent;
