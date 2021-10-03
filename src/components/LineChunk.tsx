import {h} from "preact";

import type {FunctionComponent} from "preact";
import {createUseStyles} from "react-jss";

import * as sx from "../style-util";
import {LineChunk} from "../typings/chunk";

const useStyles = createUseStyles({
	root: {
		...sx.vflex,
		width: "100%",
		height: "1em",
	},
	line: {
		width: "100%",
		height: "1px",
		backgroundColor: "white",
	},
});

type Props = {
	chunk: LineChunk;
};

const LineChunkComponent: FunctionComponent<Props> = (_props) => {
	const styles = useStyles();

	return (
		<div className={styles.root}>
			<div className={styles.line} />
		</div>
	);
};

export default LineChunkComponent;
