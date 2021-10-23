import {h} from "preact";

import type {FunctionComponent} from "preact";
import {useState} from "preact/hooks";
import {createUseStyles} from "react-jss";
import {useHistory} from "react-router";

import SlotComponent from "../components/Slot";
import {useLocalStorage} from "../hooks";
import {useDispatch} from "../store";
import {setVM} from "../store/vm";
import * as sx from "../style-util";
import {Slot} from "../typings/slot";

const useStyles = createUseStyles({
	root: {
		...sx.vflex,
		width: "100%",
		height: "100%",
		backgroundColor: "black",
		color: "white",
	},
	title: {
		fontSize: 34,
		fontWeight: "bold",
		lineHeight: "1.5em",
	},
	subtitle: {
		marginBottom: "1em",
		fontSize: 20,
		fontWeight: "normal",
		lineHeight: "1.5em",
	},
	slotList: {
		...sx.vflex,
		width: "100%",
		paddingLeft: "10rem",
		paddingRight: "10rem",
	},
	slot: {
		width: "100%",
		maxWidth: "30rem",
		marginBottom: "0.5rem",
		border: "1px solid white",

		"&:hover": {
			backgroundColor: "#0B0B0B",
		},
	},
});

const Root: FunctionComponent = () => {
	const history = useHistory();
	const dispatch = useDispatch();
	const styles = useStyles();
	const [selected, setSelected] = useState<number | null>(null);

	const slots = [
		useLocalStorage<Slot | null>("slot-0", null),
		useLocalStorage<Slot | null>("slot-1", null),
		useLocalStorage<Slot | null>("slot-2", null),
		useLocalStorage<Slot | null>("slot-3", null),
	];

	return (
		<div className={styles.root}>
			<h1 className={styles.title}>WebEra v2021.10.17</h1>
			<h2 className={styles.subtitle}>- Made by Undercrow -</h2>
			<ul className={styles.slotList}>
				{slots.map(([slot, setSlot], i) => (
					<li className={styles.slot}>
						<SlotComponent
							onCreate={(s) => { setSlot(s); setSelected(null); }}
							onDelete={() => { setSlot(null); setSelected(null); }}
							onPlay={(vm) => { dispatch(setVM(vm)); history.push(`/${i}`); }}
							onSelect={() => setSelected(i)}
							selected={i === selected}
							slot={slot}
						/>
					</li>
				))}
			</ul>
		</div>
	);
};

export default Root;
