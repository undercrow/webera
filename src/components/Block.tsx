import {h} from "preact";

import classnames from "classnames";
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
	leftAlign: {
		justifyContent: "flex-start",
	},
	centerAlign: {
		justifyContent: "center",
	},
	rightAlign: {
		justifyContent: "flex-end",
	},
});

type Props = {
	textified: boolean;
	block: Block;
};

const BlockComponent: FunctionComponent<Props> = (props) => {
	const {block, textified} = props;
	const styles = useStyles();

	let alignStyle: string;
	switch (block.align) {
		case "LEFT": alignStyle = styles.leftAlign; break;
		case "CENTER": alignStyle = styles.centerAlign; break;
		case "RIGHT": alignStyle = styles.rightAlign; break;
	}

	return (
		<div className={classnames(styles.root, alignStyle)}>
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
