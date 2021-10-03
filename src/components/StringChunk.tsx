import {h} from "preact";

import type {FunctionComponent} from "preact";
import {createUseStyles} from "react-jss";

import * as sx from "../style-util";
import {StringChunk} from "../typings/chunk";

const useStyles = createUseStyles({
	root: {
		...sx.hflex,
		minHeight: "1em",
		fontSize: 16,
		lineHeight: 1.6,
	},
});

type Props = {
	chunk: StringChunk;
};

const StringChunkComponent: FunctionComponent<Props> = (props) => {
	const {chunk} = props;
	const styles = useStyles();

	return (
		<span className={styles.root}>
			{chunk.text}
		</span>
	);
};

export default StringChunkComponent;
