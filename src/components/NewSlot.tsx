import {h} from "preact";

import classNames from "classnames";
import type {FunctionComponent} from "preact";
import {useRef, useState} from "preact/hooks";
import {createUseStyles} from "react-jss";

import AddBox from "../components/svg/AddBox";
import {Slot} from "../slot";

const useStyles = createUseStyles({
	root: {
		display: "flex",
		alignItems: "center",
		justifyContent: "flex-start",
		padding: "1em",
		fontSize: 16,
	},
	body: {
		display: "flex",
		flexDirection: "column",
		alignItems: "flex-start",
		justifyContent: "center",
		width: "100%",
		marginLeft: "0.5em",
	},
	label: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		width: "100%",

		"& + &": {
			marginTop: "0.5em",
		},
	},
	nameInput: {
		width: "100%",
		marginLeft: "0.5em",
		padding: "0.2em",
		border: "1px solid white",
		backgroundColor: "transparent",
		color: "white",

		"&:focus": {
			outline: "none",
		},
	},
	fileInput: {
		width: "100%",
		marginLeft: "2em",

		"&:focus": {
			outline: "none",
		},
	},
});

type Props = {
	className?: string;
	onCreate?: (slot: Slot) => void;
};

const NewSlot: FunctionComponent<Props> = (props) => {
	const {className} = props;
	const styles = useStyles();
	const [name, setName] = useState("");
	const fileRef = useRef<HTMLInputElement>(null);

	return (
		<div className={classNames([styles.root, className])}>
			<AddBox color="white" size={48} />
			<div className={styles.body}>
				<label className={styles.label}>
					Name:
					<input
						className={styles.nameInput}
						type="text"
						value={name}
						onChange={(e) => setName((e.target as HTMLInputElement).value)}
					/>
				</label>
				<label className={styles.label}>
					File:
					<input className={styles.fileInput} type="file" ref={fileRef} />
				</label>
			</div>
		</div>
	);
};

export default NewSlot;
