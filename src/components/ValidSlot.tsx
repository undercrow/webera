import {h} from "preact";

import type {FunctionComponent} from "preact";
import {createUseStyles} from "react-jss";

import Delete from "../components/svg/Delete";
import PlayCircleFilled from "../components/svg/PlayCircleFilled";
import {Slot} from "../slot";
import * as sx from "../style-util";

const useStyles = createUseStyles({
	root: {
		...sx.hflex,
		padding: "1em",
		fontSize: 16,
	},
	body: {
		width: "100%",
	},
	icon: {
		marginLeft: "1em",
		cursor: "pointer",
	},
});

type Props = {
	onSelect?: () => void;
	onDelete?: () => void;
	slot: Slot;
};

const ValidSlot: FunctionComponent<Props> = (props) => {
	const {onSelect, onDelete, slot} = props;

	const styles = useStyles();

	return (
		<div className={styles.root}>
			<div className={styles.body}>
				{slot.name}
			</div>
			<PlayCircleFilled className={styles.icon} color="white" size={48} onClick={onSelect} />
			<Delete className={styles.icon} color="white" size={48} onClick={onDelete} />
		</div>
	);
};

export default ValidSlot;
