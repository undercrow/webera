import {h} from "preact";

import type {FunctionComponent} from "preact";
import {createUseStyles} from "react-jss";

import * as sx from "../style-util";
import {Block} from "../typings/chunk";

const useStyles = createUseStyles({
	root: {
		...sx.vflex,
		fontSize: 16,
	},
});

type Props = {
	block: Block;
};

const BlockComponent: FunctionComponent<Props> = (props) => {
	const {block} = props;
	const styles = useStyles();

	return (
		<div className={styles.root}>
			{block.chunks.map((chunk) => chunk.text)}
		</div>
	);
};

export default BlockComponent;
