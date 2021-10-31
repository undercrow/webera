import {h} from "preact";

import type {FunctionComponent} from "preact";
import {useState} from "preact/hooks";
import {createUseStyles} from "react-jss";
import {useHistory} from "react-router";

import AddBox from "../components/svg/AddBox";
import NewSlot from "../components/NewSlot";
import ValidSlot from "../components/ValidSlot";
import {useAsyncEffect} from "../hooks";
import {useDispatch, useSelector} from "../store";
import {createSlot, rehydrateSlots, removeSlot, selectSlots} from "../store/slot";
import * as sx from "../style-util";
import {Slot} from "../typings/metadata";

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
	link: {
		color: "skyblue !important",
		textDecoration: "underline !important",
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
	new: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		width: "100%",
		height: "100%",
		padding: "1em",
		cursor: "pointer",
	},
});

const Root: FunctionComponent = () => {
	const history = useHistory();
	const dispatch = useDispatch();
	const styles = useStyles();

	const [isCreating, setIsCreating] = useState(false);
	const slotMap = useSelector(selectSlots);

	useAsyncEffect(() => dispatch(rehydrateSlots()), []);

	const onPlay = (slot: Slot) => history.push("/slot/" + slot.name);
	const onDelete = (slot: Slot) => dispatch(removeSlot(slot.name));
	const onCreate = async (slot: Slot, file: File) => {
		await dispatch(createSlot(slot, file));
		setIsCreating(false);
	};

	const slotKeys = Object.keys(slotMap);
	slotKeys.sort();

	return (
		<div className={styles.root}>
			<h1 className={styles.title}>WebEra v2021.10.31</h1>
			<h2 className={styles.subtitle}>
				- Created by <a className={styles.link} href="https://github.com/undercrow">Undercrow</a> -
			</h2>
			<ul className={styles.slotList}>
				{slotKeys.map((key) => (
					<li className={styles.slot}>
						<ValidSlot slot={slotMap[key]} onPlay={onPlay} onDelete={onDelete} />
					</li>
				))}
				<li className={styles.slot}>
					{isCreating ?
						<NewSlot onCreate={onCreate} /> :
						<div className={styles.new} onClick={() => setIsCreating(true)}>
							<AddBox color="white" size={48} />
						</div>
					}
				</li>
			</ul>
		</div>
	);
};

export default Root;
