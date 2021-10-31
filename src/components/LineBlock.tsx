import {h} from "preact";

import classnames from "classnames";
import {LineOutput} from "erajs";
import type {ComponentChild, FunctionComponent} from "preact";
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
		height: "0px",
	},
	single: {
		borderTop: "2px solid",
	},
	double: {
		borderTop: "4px double",
	},
	dot: {
		borderTop: "2px dotted",
	},
	text: {
		maxWidth: "100%",
		minHeight: "1em",
		fontSize: 16,
		lineHeight: 1.6,
		whitespace: "nowrap",
		overflow: "hidden",
	},
});

type Props = {
	block: LineOutput;
};

const LineChunkComponent: FunctionComponent<Props> = (props) => {
	const {block} = props;
	const styles = useStyles();

	let child: ComponentChild;
	if (block.value == null || block.value === "-" || block.value === "━") {
		child = <div className={classnames(styles.line, styles.single)} />
	} else if (block.value === "=") {
		child = <div className={classnames(styles.line, styles.double)} />
	} else if (block.value === ".") {
		child = <div className={classnames(styles.line, styles.dot)} />
	} else {
		child = (
			<span className={styles.text}>
				{block.value.repeat(1000)}
			</span>
		)
	}

	return (
		<div className={styles.root}>{child}</div>
	);
};

export default LineChunkComponent;
