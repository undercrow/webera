import {h} from "preact";

import {LineOutput} from "erajs";
import type {FunctionComponent} from "preact";
import {createUseStyles} from "react-jss";

import * as sx from "../style-util";

const useStyles = createUseStyles({
	root: {
		...sx.vflex,
		flexShrink: 0,
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
	block: LineOutput;
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
