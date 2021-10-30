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
	bold: {
		fontWeight: "bold",
	},
	italic: {
		fontStyle: "italic",
	},
	underline: {
		textDecoration: "underline",
	},
	color: (chunk: ButtonChunk) => ({
		color: "#" + chunk.style.color,
		"&:hover": {
			color: "#" + chunk.style.focus,
		},
	}),
});

type Props = {
	textified?: boolean;
	chunk: ButtonChunk;
};

const ButtonChunkComponent: FunctionComponent<Props> = (props) => {
	const {chunk, textified} = props;
	const dispatch = useDispatch();
	const styles = useStyles(chunk);
	const onClick = (event: MouseEvent) => {
		dispatch(pushInput({type: "normal", value: chunk.value}));
		dispatch(refreshTextified());
		event.stopPropagation();
	};

	const textStyles: string[] = [];
	switch (chunk.cell) {
		case "LEFT": textStyles.push(styles.leftAlign); break;
		case "RIGHT": textStyles.push(styles.rightAlign); break;
		default: break;
	}
	if (chunk.style.bold) {
		textStyles.push(styles.bold);
	}
	if (chunk.style.italic) {
		textStyles.push(styles.italic);
	}
	if (chunk.style.underline) {
		textStyles.push(styles.underline);
	}
	textStyles.push(styles.color);

	if (textified === true) {
		return <StringChunk chunk={{...chunk, type: "string"}} />;
	} else {
		return (
			<button className={classnames(styles.root, ...textStyles)} onClick={onClick}>
				{chunk.text}
			</button>
		);
	}
};

export default ButtonChunkComponent;
