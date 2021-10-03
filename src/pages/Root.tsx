import {h} from "preact";

import type {FunctionComponent} from "preact";
import {createUseStyles} from "react-jss";

import EmptySlot from "../components/EmptySlot";
import ValidSlot from "../components/ValidSlot";
import {useLocalStorage} from "../hooks";
import {Slot} from "../slot";

const useStyles = createUseStyles({
	root: {
		width: "100%",
		height: "100%",
		backgroundColor: "black",
		color: "white",
	},
	body: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		width: "100%",
		height: "100%",
	},
	title: {
		fontSize: 34,
		fontWeight: "bold",
		lineHeight: "1.5em",
	},
	subtitle: {
		fontSize: 24,
		fontWeight: "normal",
		lineHeight: "1.5em",
	},
	slotList: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",

		"& > li": {
			marginLeft: "0.5rem",
			marginRight: "0.5rem",
		},
	},
});

const Root: FunctionComponent = () => {
	const styles = useStyles();

	const slots = [
		useLocalStorage<Slot | null>("slot-1", null),
		useLocalStorage<Slot | null>("slot-2", null),
		useLocalStorage<Slot | null>("slot-3", null),
		useLocalStorage<Slot | null>("slot-4", null),
		useLocalStorage<Slot | null>("slot-5", null),
		useLocalStorage<Slot | null>("slot-6", null),
	];

	return (
		<div class={styles.root}>
			<div class={styles.body}>
				<h1 class={styles.title}>WebEra v2021.10.01</h1>
				<h2 class={styles.subtitle}>eraJS v0.1.0</h2>
				<ul class={styles.slotList}>
					{slots.map(([slot]) => (
						<li>
							{slot != null ? <ValidSlot slot={slot} /> : <EmptySlot />}
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default Root;
