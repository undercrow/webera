import {h} from "preact";

import classnames from "classnames";
import {ButtonChunk} from "erajs";
import type {FunctionComponent} from "preact";
import {createUseStyles} from "react-jss";

import StringChunk from "../components/StringChunk";
import {useDispatch} from "../store";
import {refreshTextified} from "../store/log";
import {pushInput} from "../store/vm";

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
	textified?: boolean;
	chunk: ButtonChunk;
};

const ButtonChunkComponent: FunctionComponent<Props> = (props) => {
	const {chunk, textified} = props;
	const dispatch = useDispatch();
	const styles = useStyles();
	const onClick = (event: MouseEvent) => {
		dispatch(pushInput({type: "normal", value: chunk.value}));
		dispatch(refreshTextified());
		event.stopPropagation();
	};

	let alignStyle: string;
	switch (chunk.cell) {
		case "LEFT": alignStyle = styles.leftAlign; break;
		case "RIGHT": alignStyle = styles.rightAlign; break;
		default: alignStyle = ""; break;
	}

	if (textified === true) {
		return <StringChunk chunk={{...chunk, type: "string"}} />;
	} else {
		return (
			<button className={classnames(styles.root, alignStyle)} onClick={onClick}>
				{chunk.text}
			</button>
		);
	}
};

export default ButtonChunkComponent;
