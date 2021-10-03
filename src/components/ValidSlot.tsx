import {h} from "preact";

import type {FunctionComponent} from "preact";
import {createUseStyles} from "react-jss";

import {Slot} from "../slot";

const useStyles = createUseStyles({
	root: {},
});

type Props = {
	slot: Slot;
};

const ValidSlot: FunctionComponent<Props> = (props) => {
	const {slot} = props;

	const styles = useStyles();

	return (
		<div class={styles.root}>
			{slot.name}
		</div>
	);
};

export default ValidSlot;
