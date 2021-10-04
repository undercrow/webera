import {h} from "preact";

import classnames from "classnames";
import type {FunctionComponent} from "preact";
import {createUseStyles} from "react-jss";

import StringChunk from "../components/StringChunk";
import {useDispatch} from "../store";
import {refreshTextified} from "../store/log";
import {pushInput} from "../store/vm";
import {ButtonChunk} from "../typings/chunk";

const useStyles = createUseStyles({
	root: {
		minHeight: "1em",
		fontSize: 16,
		lineHeight: 1.6,
		color: "white",
		cursor: "pointer",

		"&:hover": {
			color: "yellow",
		},
	},
	leftAlign: {
		width: "10em",
		justifyContent: "flex-start",
		textAlign: "left",
	},
	rightAlign: {
		width: "10em",
		justifyContent: "flex-end",
		textAlign: "right",
	},
});

type Props = {
	textified?: boolean;
	chunk: ButtonChunk;
};

const ButtonChunkComponent: FunctionComponent<Props> = (props) => {
	const {chunk, textified} = props;
	const dispatch = useDispatch();
	const styles = useStyles();
	const onClick = () => {
		dispatch(pushInput(chunk.value));
		dispatch(refreshTextified());
	};

	let alignStyle: string;
	switch (chunk.cell) {
		case "LEFT": alignStyle = styles.leftAlign; break;
		case "RIGHT": alignStyle = styles.rightAlign; break;
		default: alignStyle = ""; break;
	}

	if (textified === true) {
		return (
			<StringChunk
				textified
				chunk={{type: "string", text: chunk.text, cell: chunk.cell}}
			/>
		);
	} else {
		return (
			<button className={classnames(styles.root, alignStyle)} onClick={onClick}>
				{chunk.text}
			</button>
		);
	}
};

export default ButtonChunkComponent;
