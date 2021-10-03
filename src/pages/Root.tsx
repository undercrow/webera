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
		marginBottom: "1em",
		fontSize: 24,
		fontWeight: "normal",
		lineHeight: "1.5em",
	},
	slotList: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
	slot: {
		marginLeft: "0.5rem",
		marginRight: "0.5rem",
	},
});

const Root: FunctionComponent = () => {
	const styles = useStyles();

	const slots = [
		useLocalStorage<Slot | null>("slot-1", null),
		useLocalStorage<Slot | null>("slot-2", null),
		useLocalStorage<Slot | null>("slot-3", null),
		useLocalStorage<Slot | null>("slot-4", null),
	];

	return (
		<div className={styles.root}>
			<div className={styles.body}>
				<h1 className={styles.title}>WebEra v2021.10.01</h1>
				<h2 className={styles.subtitle}>eraJS v0.1.0</h2>
				<ul className={styles.slotList}>
					{slots.map(([slot]) => (
						<li className={styles.slot}>
							{slot != null ?
								<ValidSlot slot={slot} /> :
								<EmptySlot />
							}
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default Root;
