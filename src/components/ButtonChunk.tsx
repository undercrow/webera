import {h} from "preact";

import type {FunctionComponent} from "preact";
import {createUseStyles} from "react-jss";

import {useDispatch} from "../store";
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
	chunk: ButtonChunk;
};

const ButtonChunkComponent: FunctionComponent<Props> = (props) => {
	const {chunk} = props;
	const dispatch = useDispatch();
	const styles = useStyles();

	return (
		<button className={styles.root} onClick={() => dispatch(pushInput(chunk.value))}>
			{chunk.text}
		</button>
	);
};

export default ButtonChunkComponent;
