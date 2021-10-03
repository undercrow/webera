import {h} from "preact";

import type {FunctionComponent} from "preact";
import {createUseStyles} from "react-jss";

import StringChunk from "../components/StringChunk";
import {useDispatch} from "../store";
import {refreshTextified} from "../store/log";
import {pushInput} from "../store/vm";
import {ButtonChunk} from "../typings/chunk";

const useStyles = createUseStyles({
	root: {
		width: "100%",
		minHeight: "1em",
		fontSize: 16,
		lineHeight: 1.6,
		color: "white",
		cursor: "pointer",

		"&:hover": {
			color: "yellow",
		},
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

	if (textified === true) {
		return (
			<StringChunk
				textified
				chunk={{type: "string", text: chunk.text, cell: chunk.cell}}
			/>
		);
	} else {
		return (
			<button className={styles.root} onClick={onClick}>
				{chunk.text}
			</button>
		);
	}
};

export default ButtonChunkComponent;
