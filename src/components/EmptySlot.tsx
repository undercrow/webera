import {h} from "preact";

import classNames from "classnames";
import type {FunctionComponent} from "preact";
import {createUseStyles} from "react-jss";

import AddBox from "../components/svg/AddBox";
import {Slot} from "../slot";

const useStyles = createUseStyles({
	root: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		padding: "1em",
		border: "1px solid white",
		cursor: "pointer",

		"&:hover": {
			backgroundColor: "#222222",
		},
	},
	text: {
		marginTop: "0.5em",
		fontSize: 16,
	},
});

type Props = {
	className?: string;
	onCreate?: (slot: Slot) => void;
};

const EmptySlot: FunctionComponent<Props> = (props) => {
	const {className} = props;
	const styles = useStyles();

	return (
		<div className={classNames([styles.root, className])}>
			<AddBox color="white" size={48} />
			<span className={styles.text}>Empty Slot</span>
		</div>
	);
};

export default EmptySlot;
