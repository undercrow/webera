import {h} from "preact";

import type {FunctionComponent} from "preact";
import {createUseStyles} from "react-jss";

import {Slot} from "../slot";

const useStyles = createUseStyles({
	root: {},
});

type Props = {
	onCreate?: (slot: Slot) => void;
};

const EmptySlot: FunctionComponent<Props> = (_props) => {
	const styles = useStyles();

	return (
		<div class={styles.root}>
			New Slot
		</div>
	);
};

export default EmptySlot;
