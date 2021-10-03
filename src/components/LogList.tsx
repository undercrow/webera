import {h} from "preact";

import classNames from "classnames";
import type {FunctionComponent} from "preact";
import {createUseStyles} from "react-jss";

import * as sx from "../style-util";

const useStyles = createUseStyles({
	root: {
		...sx.vflex,
		fontSize: 16,
	},
});

type Props = {
	className?: string;
};

const LogList: FunctionComponent<Props> = (props) => {
	const {className} = props;
	const styles = useStyles();

	return (
		<div className={classNames([styles.root, className])}>
			Body
		</div>
	);
};

export default LogList;
