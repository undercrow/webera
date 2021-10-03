import {h} from "preact";

import type {FunctionComponent} from "preact";
import {createUseStyles} from "react-jss";

import ButtonChunk from "../components/ButtonChunk";
import LineChunk from "../components/LineChunk";
import StringChunk from "../components/StringChunk";
import * as sx from "../style-util";
import {Block} from "../typings/chunk";

const useStyles = createUseStyles({
	root: {
		...sx.hflex,
		alignItems: "stretch",
		fontSize: 16,
	},
});

type Props = {
	textified: boolean;
	block: Block;
};

const BlockComponent: FunctionComponent<Props> = (props) => {
	const {block, textified} = props;
	const styles = useStyles();

	return (
		<div className={styles.root}>
			{block.chunks.map((chunk) => {
				switch (chunk.type) {
					case "button": return <ButtonChunk chunk={chunk} textified={textified} />;
					case "line": return <LineChunk chunk={chunk} />;
					case "string": return <StringChunk chunk={chunk} textified={textified} />;
				}
			})}
		</div>
	);
};

export default BlockComponent;
