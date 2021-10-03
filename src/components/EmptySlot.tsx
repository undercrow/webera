import {h} from "preact";

import classNames from "classnames";
import type {FunctionComponent} from "preact";
import {createUseStyles} from "react-jss";

import AddBox from "../components/svg/AddBox";

const useStyles = createUseStyles({
	root: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		padding: "1em",
		fontSize: 16,
		cursor: "pointer",
	},
	text: {
		marginTop: "0.5em",
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
			<AddBox color="white" size={48} />
			<span className={styles.text}>Empty Slot</span>
		</div>
	);
};

export default EmptySlot;
