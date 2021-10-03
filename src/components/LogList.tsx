import {h} from "preact";

import classNames from "classnames";
import type {FunctionComponent} from "preact";
import {createUseStyles} from "react-jss";

import Block from "../components/Block";
import {useSelector} from "../store";
import {selectBlocks} from "../store/log";
import * as sx from "../style-util";

const useStyles = createUseStyles({
	root: {
		...sx.vflex,
		alignItems: "stretch",
		fontSize: 16,
	},
});

type Props = {
	className?: string;
};

const LogList: FunctionComponent<Props> = (props) => {
	const {className} = props;
	const styles = useStyles();
	const blocks = useSelector(selectBlocks);

	return (
		<div className={classNames([styles.root, className])}>
			{blocks.map((block) => <Block block={block} />)}
		</div>
	);
};

export default LogList;
