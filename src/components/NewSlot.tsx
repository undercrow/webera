import {h} from "preact";

import classNames from "classnames";
import type {FunctionComponent} from "preact";
import {useRef, useState} from "preact/hooks";
import {createUseStyles} from "react-jss";

import {Slot} from "../slot";

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
	label: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
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
		marginLeft: "0.5em",

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
	);
};

export default NewSlot;
