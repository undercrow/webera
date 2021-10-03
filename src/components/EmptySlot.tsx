import {h} from "preact";

import classNames from "classnames";
import type {FunctionComponent} from "preact";
import {createUseStyles} from "react-jss";

import AddBox from "../components/svg/AddBox";
import * as sx from "../style-util";

const useStyles = createUseStyles({
	root: {
		...sx.hflex,
		padding: "1em",
		fontSize: 16,
	},
	text: {
		width: "100%",
		marginRight: "0.5em",
	},
	icon: {
		cursor: "pointer",
	},
});

type Props = {
	className?: string;
	onClick?: () => void;
};

const EmptySlot: FunctionComponent<Props> = (props) => {
	const {className, onClick} = props;
	const styles = useStyles();

	return (
		<div className={classNames([styles.root, className])} onClick={onClick}>
			<span className={styles.text}>Empty Slot</span>
			<AddBox className={styles.icon} color="white" size={48} />
		</div>
	);
};

export default EmptySlot;
