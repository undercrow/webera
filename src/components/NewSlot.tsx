import {h} from "preact";

import classNames from "classnames";
import {loadAsync} from "jszip";
import type {FunctionComponent} from "preact";
import {useRef, useState} from "preact/hooks";
import {createUseStyles} from "react-jss";

import CheckCircle from "../components/svg/CheckCircle";
import Sync from "../components/svg/Sync";
import {Slot} from "../slot";

const useStyles = createUseStyles({
	"@keyframes spin": {
		"100%": {
			transform: "rotate(-360deg)",
		},
	},
	root: {
		display: "flex",
		alignItems: "center",
		justifyContent: "flex-start",
		padding: "1em",
		fontSize: 16,
	},
	icon: {
		cursor: "pointer",
	},
	spin: {
		animation: "$spin 2s linear infinite",
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
		marginBottom: "0.5em",
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
	error: {
		fontSize: 14,
		color: "red",
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
	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const fileRef = useRef<HTMLInputElement>(null);
	const onSubmit = async () => {
		if (isSubmitting) {
			return;
		}
		setIsSubmitting(true);
		try {
			const file = fileRef.current!.files?.item(0);

			if (name === "") {
				throw new Error("Please set the name of the slot");
			} else if (file == null) {
				throw new Error("Please specify the file for this slot");
			} else if (file.type !== "application/zip") {
				throw new Error("Only zip file is supported");
			}

			const buffer = await file.arrayBuffer();
			const zip = await loadAsync(buffer);
			console.log(zip);
		} catch (e) {
			setError((e as Error).message);
		}
		setIsSubmitting(false);
	};

	return (
		<div className={classNames([styles.root, className])}>
			{isSubmitting ?
				<Sync className={classNames(styles.icon, styles.spin)} color="white" size={48} /> :
				<CheckCircle className={styles.icon} color="white" size={48} onClick={onSubmit} />
			}
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
				{error != null ?
					<span className={styles.error}>{error}</span> :
					null
				}
			</div>
		</div>
	);
};

export default NewSlot;
